/etc/arangodb3/arangod.conf 
sudo systemctl enable arangodb3.service
sudo systemctl disable arangodb3.service
sudo systemctl restart arangodb3.service
journalctl -u arangodb3.service -b --no-pager
arangosh

python -m venv backend
source backend/bin/activate
deactivate

pip install -r requirements.txt

uvicorn main:app --reload
