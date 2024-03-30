import { useState, useEffect } from "react";

function Home() {
  const [dataList, setDataList] = useState([]);
  const [dataNow, setDataNow] = useState(40);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // useEffect untuk memanggil fetchData saat komponen dimuat pertama kali

  const handleScroll = () => {
    const isBottom =
      window.innerHeight + Math.round(window.scrollY) >=
      document.documentElement.scrollHeight;

    if (isBottom && !isLoading) {
      setIsLoading(true);
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      let url = `http://localhost:3000/api/getData?page=${Math.ceil(
        dataNow / 20
      )}&pageSize=20`;
      const response = await fetch(url);
      const jsonData = await response.json();
      setDataList((prevDataList) => [
        ...prevDataList,
        ...jsonData.data.sort(() => Math.random() - 0.5),
      ]);
      setDataNow((prevDataNow) => prevDataNow + 20);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid pt-3">
      <h3 className="text-center pb-3" style={{ color: "var(--text)" }}>
        Explore Shared Gallery ٩(˵˃̶ω˂̶˵)◞
      </h3>

      <div className="card-columns" id="cardContainer">
        {/* Sample image cards */}
        {dataList.map((entry, index) => (
          <a
            key={index}
            href={`/details/${entry.id}`}
            className="card bg-transparent"
          >
            <img
              className="card imgCard"
              src={`${entry.imgLink}${
                entry.imgLink && entry.imgLink.includes("imagekit.io")
                  ? "?updatedAt=1705798245623"
                  : ""
              }`}
              style={{
                borderRadius: "24px",
                maxHeight: `${
                  Math.floor(Math.random() * (500 - 350 + 1)) + 350
                }px`,
                objectFit: "cover",
              }}
              alt="Gallery"
            />
            <p className="ml-3 text-white">{entry.nama}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Home;
