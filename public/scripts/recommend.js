<script type="module">
  const books = JSON.parse(document.getElementById('books-data').textContent);
  const TOPICS = JSON.parse(document.getElementById('topics-data').textContent);

  let currentTopic = "";
  let currentFiltered = [];
  let currentBook = null;

  // ⚙️ Khởi tạo recommend logic
  function initRecommend() {
    const resultDiv = document.getElementById('recommend-result');

    function pickRandom() {
      if (!currentFiltered.length) return null;
      const pick = currentFiltered[Math.floor(Math.random() * currentFiltered.length)];
      console.log("🎲 Random pick:", pick.title);
      return pick;
    }

    function showBook(book) {
      currentBook = book;
      resultDiv.innerHTML = `
        <div class="fade-in">
          <p class="book-title">📖 ${book.title}</p>
          <div class="recommend-actions">
            <a href="${book.href}" class="recommend-btn">📖 Xem ngay</a>
            <button id="change-book-btn" class="recommend-btn alt">🔁 Đổi sách</button>
          </div>
        </div>
      `;
      document.getElementById("change-book-btn")?.addEventListener("click", () => {
        const newBook = pickRandom();
        if (newBook && newBook.href !== currentBook.href) {
          showBook(newBook);
        }
      });
    }

    // Gán sự kiện cho các nút chủ đề
    document.querySelectorAll('.topic-button').forEach(button => {
      const topic = button.getAttribute('data-topic');
      button.addEventListener('click', () => {
        console.log("👉 Clicked topic:", topic);
        currentTopic = topic;
        const tags = TOPICS[currentTopic];
        currentFiltered = books.filter(book =>
          book.tags.some(tag => tags.includes(tag))
        );
        console.log("🔎 Filtered count:", currentFiltered.length);

        if (currentFiltered.length === 0) {
          resultDiv.innerHTML = '<p>Không tìm thấy sách phù hợp.</p>';
          return;
        }

        const randomBook = pickRandom();
        showBook(randomBook);
      });
    });
  }

  // ✅ Khởi động ban đầu
  document.addEventListener("DOMContentLoaded", () => {
    initRecommend();
  });

  // ✅ Khi quay lại từ nút Back, chỉ reload lại phần #recommend-wrapper
  window.addEventListener("pageshow", async (event) => {
    if (event.persisted) {
      console.log("🔁 BACK detected — refreshing #recommend-wrapper only");

      try {
        const response = await fetch(location.pathname);
        const html = await response.text();
        const temp = document.createElement("div");
        temp.innerHTML = html;

        const newSection = temp.querySelector("#recommend-wrapper");
        const oldSection = document.querySelector("#recommend-wrapper");

        if (newSection && oldSection) {
          oldSection.replaceWith(newSection);
          console.log("✅ Recommend section reloaded");

          // Gọi lại init sau khi DOM bị thay
          initRecommend();
        }
      } catch (err) {
        console.error("❌ Failed to reload recommend section:", err);
      }
    }
  });
</script>