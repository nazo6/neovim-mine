import { IoArrowUp } from "react-icons/io5";

export function GoTopButton() {
  const returnTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={returnTop}
      className="fixed bottom-[30px] right-[30px] z-10 bg-blue-400/50 rounded-full p-2"
    >
      <IoArrowUp className="text-3xl text-white" />
    </button>
  );
}
