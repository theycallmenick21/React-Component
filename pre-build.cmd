@echo off
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"

set "DISPLAY_VERSION=%YYYY%.%MM%.%DD%"
echo DISPLAY_VERSION: "%DISPLAY_VERSION%"

set "BUILT_ON=%DD%-%MM%-%YYYY% %HH%:%Min%:%Sec%"
echo BUILT_ON: "%BUILT_ON%"

git rev-parse @~ > lastCommit.txt
set /p LAST_COMMIT=<lastCommit.txt
del lastCommit.txt
echo LAST_COMMIT: "%LAST_COMMIT%"