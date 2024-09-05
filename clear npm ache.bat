@echo off
:: Define the paths
set "cacheDataPath=C:\Users\apurv\AppData\Local\npm-cache"

:: Check if the Cache directory exists
if exist "%cacheDataPath%" (
    echo Cache directory exists.

    :: Check if the Cache_Data directory exists
    if exist "%cacheDataPath%" (
        echo Cache_Data directory exists at: %cachePath%
        echo Cache_Data directory exists at: %cacheDataPath%
        
        :: Delete all files in the Cache_Data directory and subdirectories
        del /f /q /s "%cacheDataPath%\*"
        echo All files in Cache_Data have been deleted.
    ) else (
        echo Cache_Data directory does not exist.
    )
) else (
    echo Cache directory does not exist.
    echo Cache_Data directory exists at: %cachePath%
    echo Cache_Data directory exists at: %cacheDataPath%
)
pause