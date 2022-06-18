import { useRef, useState, useEffect } from "react";

/**
 * @template T
 * @param {React.MutableRefObject<HTMLInputElement>} inputRef
 * @param {T[]} dataList
 * @returns {T[]}
 */
export default function useAsyncInputStringDistance(inputRef, dataList) {
  const [list, setList] = useState(dataList);

  const worker = useRef(/** @type {Worker} */ (null));

  useEffect(() => {
    const workerMemo = new Worker("./worker/asyncInput.worker.js", {
      type: "module"
    });
    worker.current = workerMemo;
    const onMessage = ({ data }) => {
      if (inputRef.current.value === data.input) {
        setList(data.list);
      }
    };
    workerMemo.addEventListener("message", onMessage);
    return () => {
      workerMemo.removeEventListener("message", onMessage);
      workerMemo.terminate();
    };
  }, [inputRef]);

  useEffect(() => {
    worker.current.postMessage({ type: "list", list: dataList });
    const { current: inputMemo } = inputRef;
    const onInput = () => {
      worker.current.postMessage({ type: "input", input: inputMemo.value });
    };
    onInput();
    inputMemo.addEventListener("input", onInput, { passive: true });
    return () => {
      inputMemo.removeEventListener("input", onInput, { passive: true });
    };
  }, [dataList, inputRef]);

  return list;
}
