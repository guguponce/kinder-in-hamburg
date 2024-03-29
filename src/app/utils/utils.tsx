export const handleScroll = (
  setCount: (value: React.SetStateAction<number>) => void,
  count: number
) => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  if (scrollTop + clientHeight >= scrollHeight - 200 && count < 100) {
    setCount(count + 10);
  }
};
