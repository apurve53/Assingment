@echo off
:: Define the paths
set "cachePath=%APPDATA%\Code - Insiders\Cache"
set "cacheDataPath=%APPDATA%\Code - Insiders\Cache\Cache_Data"

:: Check if the Cache directory exists
if exist "%cachePath%" (
    echo Cache directory exists.

    :: Check if the Cache_Data directory exists
    if exist "%cacheDataPath%" (
        echo Cache_Data directory exists.
        
        :: Delete all files in the Cache_Data directory and subdirectories
        del /f /q /s "%cacheDataPath%\*"
        echo All files in Cache_Data have been deleted.
    ) else (
        echo Cache_Data directory does not exist.
    )
) else (
    echo Cache directory does not exist.
)
pause

