async function asyncly(func) {
    return func.then
      ? await func()
      : new Promise((done) => {
          func(done)
        });
}

asyncly.delay = async function asyncDelay(delta) {
    return new Promise((done) => {
        setTimeout(done, delta);
    });
}

asyncly.sort = async function asyncSort(arr, compareFunc, left = 0, right = arr.length - 1) {
  if (left < right) {
    let i = left, j = right, tmp;
    const pivot = await asyncSortGetPivot(arr[i], arr[i + Math.floor((j - i) / 2)], arr[j], compareFunc);
    while (true) {
      while (await compareFunc(arr[i],  pivot) < 0) {
        i++;
      }
      while (await compareFunc(pivot, arr[j]) < 0) {
        j--;
      }
      if (i >= j) {
        break;
      }
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;

      i++;
      j--;
    }
    await asyncSort(arr, compareFunc, left, i - 1);
    await asyncSort(arr, compareFunc, j + 1, right);
  }
  return arr;
}

async function asyncSortGetPivot(prev, self, next, compareFunc) {
  if (await compareFunc(prev, self) < 0) {
    if (await compareFunc(self, next) < 0) {
      return self;
    } else if (await compareFunc(next, prev) < 0) {
      return prev;
    } else {
      return next;
    }
  } else if (await compareFunc(self, next) > 0) {
    return self;
  } else if (await compareFunc(next, prev) > 0) {
    return prev;
  } else {
    return next;
  }
}

asyncly.loop = function loop(method) {
    let shouldStop = false;

    asyncly(async ()=>{
        let result;
        while(!shouldStop) {
            result = await method(result);
            if(result === undefined)
                shouldStop = true;
        }
    })

    return function stop() {
        shouldStop = true;
    }
}

asyncly.milli = asyncly.millis = 1;
asyncly.second = asyncly.seconds = asyncly.millis * 1000;
asyncly.minute = asyncly.minutes = asyncly.seconds * 60;
asyncly.hour = asyncly.hours = asyncly.minutes * 60;
asyncly.day = asyncly.days = asyncly.hours * 24;
asyncly.week = asyncly.weeks = asyncly.days * 7;
asyncly.month = asyncly.months = asyncly.days * 30;
asyncly.year = asyncly.years = asyncly.days * 365;

asyncly.getMillis = () => { Date.now(); }
asyncly.getSeconds = () => { asyncly.getMillis() / 1000; }
asyncly.getMinutes = () => { asyncly.getSeconds() / 60; }
asyncly.getHours = () => { asyncly.getMinutes() / 60; }
asyncly.getDays = () => { asyncly.getHours() / 24; }
asyncly.getWeeks = () => { asyncly.getDays() / 7; }
asyncly.getMonths = () => { asyncly.getDays() / 30; }
asyncly.getYears = () => { asyncly.getDays() / 365; }

module.exports = exports = asyncly;
