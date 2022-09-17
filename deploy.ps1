Remove-Item -Recurse .\api\public\; cd .\client\; npm run build; cd ..; Move-Item -Path .\client\build\ -Destination .\api\; Rename-Item .\api\build\ public; cd .\api\; gcloud app deploy -q; cd ..;
