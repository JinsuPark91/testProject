export const LogoutTimer = (() => {
  let flag = true;
  const timerConfig = {
    timer: null,
    limit: 1000 * 60 * 60 * 12, //12시간 후 로그아웃   60 * 60 * 12
    async fnc() {
      window.location.href = `${window.location.origin}/logout`;
    },
    start(inputflag) {
      flag = inputflag;
      this.timer = setTimeout(this.fnc.bind(this), this.limit);
    },
    reset() {
      window.clearTimeout(this.timer);
      this.start(false);
    },
    end() {
      console.log('###not use');
      window.clearTimeout(this.timer);
      flag = true;
    },
  };
  document.onmousemove = () => {
    if (!flag) {
      timerConfig.reset();
    }
  };
  return timerConfig;
})();
