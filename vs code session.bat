@echo off
:: Define the paths
set "cacheDataPath=C:\Users\apurv\AppData\Local\Microsoft\Edge"
:: Check if the Cache directory exists
if exist "%cacheDataPath%" (
    echo Cache_Data directory exists at: %cacheDataPath%
    :: Delete all files in the Cache_Data directory and subdirectories
    del /f /q /s "%cacheDataPath%\*"
    echo All files in Cache_Data have been deleted.
) else (
    echo Cache_Data directory does not exist.
)

set "cacheDataPathNetwork=C:\Users\apurv\AppData\Roaming\Code\Network"
if exist "%cacheDataPathNetwork%" (
    echo Cache_Data directory exists at: %cacheDataPathNetwork%
    :: Delete all files in the Cache_Data directory and subdirectories
    del /f /q /s "%cacheDataPathNetwork%\*"
    echo All files in Cache_Data have been deleted.
) else (
    echo Cache_Data directory does not exist at: %cacheDataPathNetwork%
)


set "cacheDataPathGPUCache=C:\Users\apurv\AppData\Roaming\Code\GPUCache"
if exist "%cacheDataPathGPUCache%" (
    echo Cache_Data directory exists at: %cacheDataPathGPUCache%
    :: Delete all files in the Cache_Data directory and subdirectories
    del /f /q /s "%cacheDataPathGPUCache%\*"
    echo All files in Cache_Data have been deleted.
) else (
    echo Cache_Data directory does not exist at: %cacheDataPathGPUCache%
)

set "cacheDataPathLocalStorage=C:\Users\apurv\AppData\Roaming\Code\Local Storage"
if exist "%cacheDataPathLocalStorage%" (
    echo Cache_Data directory exists at: %cacheDataPathLocalStorage%
    :: Delete all files in the Cache_Data directory and subdirectories
    del /f /q /s "%cacheDataPathLocalStorage%\*"
    echo All files in Cache_Data have been deleted.
) else (
    echo Cache_Data directory does not exist at: %cacheDataPathLocalStorage%
)
pause