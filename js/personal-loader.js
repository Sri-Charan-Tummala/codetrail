/* Personal data: js/personal.js (git-ignored) wins. Otherwise use the copy saved on this
   device by restoring a backup file that carried it, so the public site never holds it. */
var CT_PERSONAL_SRC = typeof CT_PERSONAL !== 'undefined' ? 'file' : null;
if (!CT_PERSONAL_SRC) {
  try { var _ctp = localStorage.getItem('codetrail-personal'); if (_ctp) { var CT_PERSONAL = JSON.parse(_ctp); CT_PERSONAL_SRC = 'device'; } } catch (e) {}
}
