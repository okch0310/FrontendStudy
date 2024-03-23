export function createHooks(render) {
  let states = {};
  let statesIndex = 0;
  let memos = {};
  let memosIndex = 0;

  const useState = (initialState) => {
    const currentIndex = statesIndex;
    statesIndex++;
    if (states[currentIndex] === undefined) {
      states[currentIndex] = { state: initialState };
    }
    const setState = (newState) => {
      states[currentIndex].state = newState;
      render();
    };
    return [states[currentIndex].state, setState];
  };

  const useMemo = (factory, deps) => {
    const currentIndex = memosIndex;
    memosIndex++;
    const hasChangedDeps =
      memos[currentIndex] && !areArraysEqual(memos[currentIndex].deps, deps);
    if (!memos[currentIndex] || hasChangedDeps) {
      const value = factory();
      memos[currentIndex] = { deps, value };
    }
    return memos[currentIndex].value;
  };

  const resetContext = () => {
    statesIndex = 0;
    memosIndex = 0;
  };

  function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  return { useState, useMemo, resetContext };
}
