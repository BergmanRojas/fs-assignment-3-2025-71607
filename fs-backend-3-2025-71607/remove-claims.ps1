$projectPath = "./src"  # Asumiendo que tu código está en ./src
$files = Get-ChildItem -Path $projectPath -Recurse -Filter "*.cs"

foreach ($file in $files) {
    $content = Get-Content $file.FullName
    
    # Eliminar líneas que contienen referencias a OperationClaims
    $newContent = $content | Where-Object { $_ -notmatch "using .*\.Constants;" -or $_ -notmatch "OperationClaims" }
    
    # Eliminar atributos AuthorizeDefinition
    $newContent = $newContent -replace ',\s*AuthorizeDefinition\(.*OperationClaims.*\)', ''
    $newContent = $newContent -replace '\[AuthorizeDefinition\(.*OperationClaims.*\)\]', ''
    
    # Eliminar ISecuredRequest si existe
    $newContent = $newContent -replace ',\s*ISecuredRequest', ''
    
    # Guardar cambios
    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Modificado: $($file.FullName)"
    }
}

Write-Host "Proceso completado. Archivos modificados: $($files.Count)"

