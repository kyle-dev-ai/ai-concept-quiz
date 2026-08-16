import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, normalize, relative, resolve, sep } from 'node:path'

const rootDirectory = process.cwd()
const sourceDirectory = join(rootDirectory, 'src')
const errors = []

function sourceFiles(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry)
      return statSync(path).isDirectory() ? sourceFiles(path) : [path]
    })
    .filter((path) => /\.(?:ts|tsx)$/.test(path) && !path.endsWith('.d.ts'))
}

function sourcePath(filePath) {
  return relative(rootDirectory, filePath).split(sep).join('/')
}

function resolvedImport(filePath, specifier) {
  if (!specifier.startsWith('.')) {
    return specifier
  }

  return normalize(resolve(dirname(filePath), specifier))
    .split(sep)
    .join('/')
}

function report(filePath, message) {
  errors.push(`${sourcePath(filePath)}: ${message}`)
}

for (const filePath of sourceFiles(sourceDirectory)) {
  const file = sourcePath(filePath)
  const source = readFileSync(filePath, 'utf8')
  const imports = [...source.matchAll(/(?:from\s+|import\s*\()(['"])([^'"]+)\1/g)].map(
    (match) => match[2],
  )

  for (const specifier of imports) {
    if (specifier === undefined) {
      continue
    }
    const target = resolvedImport(filePath, specifier)

    if (file.startsWith('src/domain/')) {
      const allowedDomainImport = target.startsWith(`${sourceDirectory}/domain/`)
      const allowedTestImport = file.includes('.test.') && specifier === 'vitest'
      if (!allowedDomainImport && !allowedTestImport) {
        report(filePath, `domain은 domain 내부만 import할 수 있습니다: ${specifier}`)
      }
    }

    if (
      file.startsWith('src/application/') &&
      (target.includes('/src/features/') || target.includes('/src/infrastructure/'))
    ) {
      report(filePath, `application port가 UI/adapter를 import합니다: ${specifier}`)
    }

    if (file.startsWith('src/features/') && target.includes('/src/infrastructure/')) {
      report(filePath, `feature가 concrete adapter를 import합니다: ${specifier}`)
    }

    if (
      file.startsWith('src/shared/') &&
      (target.includes('/src/features/') || target.includes('/src/infrastructure/'))
    ) {
      report(filePath, `shared UI가 feature/adapter를 import합니다: ${specifier}`)
    }

    if (
      (specifier.startsWith('@apps-in-toss/') || specifier.startsWith('@sentry/')) &&
      !file.startsWith('src/infrastructure/')
    ) {
      report(filePath, `provider SDK는 infrastructure에서만 import할 수 있습니다: ${specifier}`)
    }
  }

  if (
    file.startsWith('src/domain/') &&
    /\b(?:window|document|navigator|localStorage)\b/.test(source)
  ) {
    report(filePath, 'domain에서 browser global을 사용합니다.')
  }

  if (file !== 'src/App.tsx' && /\bexport\s+default\b/.test(source)) {
    report(filePath, 'root App 외에는 named export를 사용해야 합니다.')
  }
}

const componentStyles = readFileSync(join(sourceDirectory, 'App.css'), 'utf8')
if (/#[\da-f]{3,8}\b|(?:rgb|hsl)a?\(/i.test(componentStyles)) {
  errors.push('src/App.css: raw color 대신 src/index.css design token을 사용해야 합니다.')
}

if (errors.length > 0) {
  console.error('ARCHITECTURE CHECK FAIL')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exitCode = 1
} else {
  console.info('Architecture boundaries and conventions passed.')
}
