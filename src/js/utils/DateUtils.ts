module pskl {
    export module utils {
        var pad = function (num) {
          if (num < 10) {
            return '0' + num;
          } else {
            return '' + num;
          }
        };

        export module DateUtils {
            export function format (date, format) {
                date = new Date(date);
                return pskl.utils.Template.replace(format, {
                  Y : date.getFullYear(),
                  M : pad(date.getMonth() + 1),
                  D : pad(date.getDate()),
                  H : pad(date.getHours()),
                  m : pad(date.getMinutes()),
                  s : pad(date.getSeconds())
                });
              }
        }
    }
}