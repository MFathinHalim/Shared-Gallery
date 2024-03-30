function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
        <a className="navbar-brand" href="/">
          <img
            src="https://ik.imagekit.io/9hpbqscxd/SG/image-3.jpg"
            width={46}
            height={46}
            alt=""
          />
        </a>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a
              className="nav-link add"
              style={{
                background: "#9dcbd8",
                color: "black",
                border: "solid #9dcbd8",
                borderRadius: 34,
                padding: 9,
              }}
              href="#"
              data-toggle="modal"
              data-target="#uploadModal"
            >
              <strong>Add Image</strong>
            </a>
          </li>
        </ul>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ border: "none !important" }}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          className="collapse navbar-collapse p-2"
          id="navbarSupportedContent"
        >
          <form className="form-inline w-100">
            {/* Add w-100 class to make the form fill the width */}
            <div className="input-group w-100">
              <input
                className="form-control rounded-pill"
                style={{
                  padding: 23,
                  borderRadius: "0px 34px 34px 0px",
                  border: "2px solid var(--secondary) !important",
                }}
                type="search"
                defaultValue=""
                id="searchInput"
                placeholder="Search (∩˃ω˂∩)"
                autoComplete="off"
                aria-label="Search"
              />
            </div>
          </form>
        </div>
      </nav>
      <div
        className="modal fade"
        id="uploadModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="uploadModalLabel"
        aria-describedby="uploadModalBody"
      >
        <div
          className="modal-dialog bg-transparent modal-xl"
          style={{ borderRadius: "12px 12px 0 0 !important" }}
          role="document"
        >
          <div
            className="modal-content shadow"
            style={{ background: "none", border: "none" }}
          >
            <div
              className="modal-header"
              style={{ borderRadius: "12px 12px 0 0 !important" }}
            >
              <h5 className="modal-title" id="uploadModalLabel">
                Add Image ⸜(｡˃ ᵕ ˂ )⸝♡
              </h5>
              <button
                type="button"
                className="text-white btn btn-md btn-danger"
                data-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </button>
            </div>
            <div
              className="modal-body"
              id="uploadModalBody"
              style={{ borderRadius: "0 0 12px 12px !important" }}
            >
              <form
                action="/post"
                method="post"
                id="myForm"
                className="row no-gutters"
                encType="multipart/form-data"
              >
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="imageName">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageName"
                      name="nama"
                      style={{ border: "2px solid var(--accent) !important" }}
                      autoComplete="off"
                      required=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="imageDesc">Description</label>
                    <textarea
                      className="form-control"
                      id="imageDesc"
                      rows={3}
                      style={{ border: "2px solid var(--accent) !important" }}
                      name="desc"
                      required=""
                      defaultValue={""}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="imageFile"
                      className="btn btn-secondary rounded-pill"
                    >
                      Choose Image
                    </label>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      className="form-control-file"
                      id="imageFile"
                      name="image"
                      accept="image/*"
                      required=""
                    />
                    <br />
                    <label htmlFor="imageLink">Or Pasted From Image Link</label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageLink"
                      style={{ border: "2px solid var(--accent) !important" }}
                      name="link"
                      autoComplete="off"
                    />
                  </div>
                  <button
                    data-sitekey="6LfslRQoAAAAAHVBGwEVitjEQSjCD6F8unKDUdct"
                    data-callback="onSubmit"
                    name="g-recaptcha-response"
                    id="postButton"
                    data-action="submit"
                    type="submit"
                    className="btn g-recaptcha btn-primary"
                  >
                    Upload
                  </button>
                </div>
                <div className="col-md-6 d-md-block pl-3" id="bruh">
                  <label>Preview</label>
                  <br />
                  <img
                    src="https://static.wikia.nocookie.net/theallever/images/0/0a/THE_Preview_logo.jpg/revision/latest?cb=20201013032038"
                    className="mb-2"
                    id="image-preview"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <a
        data-toggle="modal"
        data-target="#uploadModal"
        id="floating-button"
        className="btn btn-lg btn-primary rounded-circle"
        style={{
          height: "70px !important",
          width: "70px !important",
          fontSize: 40,
        }}
      >
        <i className="fa fa-plus" />
      </a>
      <style
        type="text/css"
        media="screen"
        dangerouslySetInnerHTML={{
          __html:
            '\n  .container-fluid {\n    padding-left: 80px !important;\n    padding-right: 80px !important;\n    margin: 0px;\n  }\n  body {\n    font-family: "Karla";\n  }\n  /* Custom styles for the Pinterest-style layout */\n  :root {\n    --text: #f5f7fe;\n    --background: #060811;\n    --primary: #cacdd8;\n    --secondary: #3d4648;\n    --accent: #67b86a;\n  }\n  .btn-primary:hover {\n    background-color: var(--secondary) !important;\n    border: 3px solid var(--accent) !important;\n  }\n  body,\n  nav {\n    background-color: var(--background);\n  }\n  .nav-brand {\n    font-family: "Montserrat" !important;\n  }\n  input,\n  textarea {\n    background-color: var(--secondary) !important;\n    color: var(--text) !important;\n    border: 2px solid var(--secondary) !important;\n  }\n  .card {\n    border: none;\n  }\n  .card,\n  img {\n    border-radius: 16px !important;\n  }\n  .card-img-top {\n    border-radius: 12px 12px 0 0;\n  }\n  ::placeholder {\n    color: var(--text) !important;\n  }\n  .card-columns {\n    column-count: 5;\n  }\n\n  .card {\n    display: inline-block;\n    width: 100%;\n    margin-bottom: 20px;\n  }\n  .modal-header,\n  .modal-footer,\n  .modal-body {\n    color: var(--text);\n    background-color: var(--secondary);\n  }\n  .btn-primary {\n    background-color: var(--accent);\n    border: solid var(--accent);\n    color: #11181a;\n  }\n  .btn-primary,\n  .modal-dialog {\n    border-radius: 30px;\n  }\n  @media (max-width: 1400px) {\n    .card-columns {\n      column-count: 4;\n    }\n  }\n  @media (max-width: 991px) {\n    .container-fluid {\n      padding: 10px !important;\n      padding-right: 25px !important;\n      margin: 0px !important;\n    }\n    .card-columns {\n      column-count: 3;\n    }\n    ::-webkit-scrollbar {\n      width: 0px;\n    }\n  }\n\n  @media (max-width: 767px) {\n    .card-columns {\n      column-count: 2;\n    }\n  }\n  @media (max-width: 460px) {\n    .card-columns {\n      column-count: 1;\n    }\n  }\n  ::-webkit-scrollbar {\n    width: 3px;\n  }\n\n  ::-webkit-scrollbar-thumb {\n    background-color: var(--accent);\n    outline: 1px solid slategrey;\n  }\n',
        }}
      />
    </>
  );
}

export default Navbar;
