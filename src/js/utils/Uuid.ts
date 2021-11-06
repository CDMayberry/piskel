module pskl {
  export module utils {
    export module Uuid {
      const s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
  
      export function generate() {
        return 'ss-s-s-s-sss'.replace(/s/g, function () {
          return s4();
        });
      }
    }
  }
}