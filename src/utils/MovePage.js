// @param {string} targetInfo - (필수) 목적지
// @param {boolean} newPage - 새 창으로 열 지 선택 - default: false

const MovePage = (targetInfo, newWindow = false) => {
  const url = window.location.href;
  const purl = url?.split('.');
  let targetURL = '';

  if (purl[0].match('127') || purl[0].match('192') || purl[0].match('local')) {
    targetURL = `${window.location.protocol}//dev.wapl.ai/${targetInfo}`;
  } else {
    const tdomain = purl[1];
    if (purl[1] === 'wapl') {
      targetURL = `${window.location.protocol}//wapl.ai/${targetInfo}`;
    } else {
      targetURL = `${window.location.protocol}//${tdomain}.wapl.ai/${targetInfo}`;
    }
  }

  if (newWindow) {
    window.open(targetURL);
  } else {
    window.location.href = targetURL;
  }
};

export default MovePage;
