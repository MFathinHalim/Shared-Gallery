import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Details() {
  const { id } = useParams();
  const [entry, setEntry] = useState({});
  const [datalist, setDatalist] = useState([]);
  const [dataNow, setDataNow] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);

  const backgroundImageUrl = entry
    ? entry.imgLink && entry.imgLink.includes("imagekit.io")
      ? `${entry.imgLink}?updatedAt=1705798245623`
      : entry.imgLink
    : "";

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/get/${id}`);
        const jsonData = await response.json();
        setEntry(jsonData.entry);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData2();

    fetchData();
  }, [id]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, [fetchingData]);

  const handleScroll = () => {
    const isBottom =
      window.innerHeight / 1.5 + Math.round(window.scrollY) >=
      document.body.offsetHeight / 1.5;

    if (isBottom && !isLoading && !fetchingData) {
      setFetchingData(true);
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/get/${id}?page=${Math.ceil(
          dataNow / 10
        )}&pageSize=10`
      );
      const jsonData = await response.json();
      console.log(jsonData.data);

      const newData = jsonData.data;
      setDataNow((prevDataNow) => prevDataNow + newData.length);
      setDatalist((prevDataList) => [...prevDataList, ...newData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetchingData(false);
      setIsLoading(false);
    }
  };

  const backButtonClickHandler = () => {
    window.history.back();
  };

  const search = () => {
    const copyText = window.location.href;

    if (navigator.share) {
      navigator.clipboard.writeText(copyText);
      navigator
        .share({
          title: "rejangpedia",
          text: "artikel untuk sanak",
          url: copyText,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      try {
        window.AndroidShareHandler.share(copyText);
      } catch {
        navigator.clipboard.writeText(copyText);
        alert("Sudah Di Salin Ya, silahkan Beri ke Temanmu ya ^_^");
      }
    }
  };

  return (
    <>
      <div className="container mt-3">
        <style>
          {`
      h6 {
        padding: 12px;
        border-radius: 12px;
        border: 1px solid var(--accent);
      }
      body {
        background-size: cover;
        background-position: center;
        background-image: url("${backgroundImageUrl}");
        
        /* Efek blur */

          /* Gradien hitam transparan */
          background-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0) 100%
          );
      }
    `}
        </style>
        <button
          id="back-button"
          className="btn btn-primary rounded-pill mb-2"
          style={{
            position: "sticky",
            top: "20px",
            left: "20px",
            zIndex: "100",
          }}
          onClick={backButtonClickHandler}
        >
          <i className="fa fa-chevron-left"></i> Back
        </button>

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-3">
              <img
                src={`${entry.imgLink}${
                  entry.imgLink && entry.imgLink.includes("imagekit.io")
                    ? "?updatedAt=1705798245623"
                    : ""
                }`}
                className="card-img"
                style={{
                  position: "absolute",
                  zIndex: "-2",
                  filter: "blur(20px)",
                }}
                alt={entry.name}
              />
              <img
                src={`${entry.imgLink}${
                  entry.imgLink && entry.imgLink.includes("imagekit.io")
                    ? "?updatedAt=1705798245623"
                    : ""
                }`}
                className="card-img"
                style={{ maxWidth: "100%" }}
                alt={entry.name}
              />
            </div>
          </div>

          <div className="col-md-6 order-md-1">
            <div
              className="card mb-3"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <div className="card-body">
                {entry.nama && (
                  <h4 className="card-title">
                    <strong>{entry.nama}</strong>
                  </h4>
                )}
                {entry.desc && <p className="card-text">{entry.desc}</p>}
                {!entry.nama && !entry.desc && (
                  <h4 className="card-title">
                    <strong>Tidak Ada Deskripsi</strong>
                  </h4>
                )}
              </div>
              <div className="card-footer">
                <a href={entry.imgLink} download={`${entry.name}.jpg`}>
                  <button className="btn btn-primary btn-sm">Download</button>
                </a>
                <button className="btn btn-primary btn-sm" onClick={search}>
                  <i className="fa fa-share" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div
              className="card mb-3"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--text)",
              }}
            >
              <div
                className="card-body"
                style={{ maxHeight: "215px", overflowY: "auto" }}
              >
                <h4 className="pb-3">Comments (｡^ ‿^♡)</h4>
                {entry.comments &&
                  entry.comments
                    .slice(0, 20)
                    .map((comment, index) => (
                      <h6 key={index}>{comment.isi}</h6>
                    ))}
                {!entry.comments && <h6>Be The First ٩(˵˃̶ω˂̶˵)◞</h6>}
              </div>
              <div
                className="card-footer"
                style={{ borderTop: "1px dashed #d8d9da" }}
              >
                <form
                  action={`/post/${entry.id}/comment`}
                  method="post"
                  className="d-flex"
                >
                  <div className="input-group flex-grow-1 mr-2">
                    <input
                      type="text"
                      className="form-control rounded-lg"
                      style={{
                        borderRadius: "24px",
                        border: "2px solid var(--accent) !important",
                      }}
                      id="comment"
                      name="comment"
                      autoComplete="off"
                      placeholder="Tambah Komentar..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <i className="fa fa-plus"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-3 text-center">
        <h3 className="text-white">More Explore ٩(˵˃̶ω˂̶˵)◞</h3>
        <div className="card-columns" id="cardContainer">
          {datalist.map((data, index) => (
            <a
              key={index}
              href={`/details/${data.id}`}
              className="card bg-transparent"
            >
              <img
                className="card imgCard"
                src={`${data.imgLink}${
                  data.imgLink && data.imgLink.includes("imagekit.io")
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
              <p className="ml-3 text-white">{data.nama}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default Details;
