# Clean old build files
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue

# Create classes and staging directories
New-Item -ItemType Directory -Path "build/classes" -Force | Out-Null
New-Item -ItemType Directory -Path "build/war_staging" -Force | Out-Null

# Resolve classpath dependencies
$libJars = Get-ChildItem -Path "src/main/webapp/WEB-INF/lib" -Filter "*.jar" | ForEach-Object { $_.FullName }
$servletApi = "C:\Users\Sabarithan P\.p2\pool\plugins\jakarta.servlet-api_6.1.0.jar"
if (-not (Test-Path $servletApi)) {
    $servletApi = "C:\Users\Sabarithan P\.vscode\extensions\redhat.java-1.54.0-win32-x64\server\plugins\jakarta.servlet-api_6.1.0.jar"
}
$classpath = ($libJars + $servletApi) -join ";"

# Compile Java files
Write-Host "Compiling Java files..."
$javaFiles = Get-ChildItem -Path "src/main/java" -Filter "*.java" -Recurse | ForEach-Object { $_.FullName }
javac -encoding UTF-8 -cp "$classpath" -d "build/classes" $javaFiles
if ($LASTEXITCODE -ne 0) {
    Write-Error "Compilation failed!"
    exit 1
}

# Copy webapp assets to staging
Write-Host "Staging webapp files..."
Copy-Item -Path "src/main/webapp/*" -Destination "build/war_staging" -Recurse -Force

# Create WEB-INF/classes if it doesn't exist
New-Item -ItemType Directory -Path "build/war_staging/WEB-INF/classes" -Force | Out-Null

# Copy classes to WEB-INF/classes
Copy-Item -Path "build/classes/*" -Destination "build/war_staging/WEB-INF/classes" -Recurse -Force

# Copy .env file to WEB-INF/classes
if (Test-Path ".env") {
    Copy-Item -Path ".env" -Destination "build/war_staging/WEB-INF/classes/.env" -Force
}

# Package WAR file
Write-Host "Creating WAR package..."
$stagingDir = Resolve-Path "build/war_staging"
$currentDir = Get-Location
Set-Location $stagingDir
jar cf ../../SmartCanteen.war *
if ($LASTEXITCODE -ne 0) {
    Write-Error "Packaging WAR failed!"
    Set-Location $currentDir
    exit 1
}
Set-Location $currentDir
Write-Host "SmartCanteen.war successfully updated!"
