# Emulator tests

End-to-end checks on an emulated iPhone 13. The app's Python runner normally downloads Pyodide;
here `stub.js` stands in for it and forwards code to real CPython (`pyexec.py`), so drills and the IDE
run real Python without a network.

```bash
pip install playwright && playwright install chromium
./run_all.sh            # or: python3 test_drills.py
```

Each script prints what it checked and ends with the page errors seen (should be `[]`).
