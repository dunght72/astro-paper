document.addEventListener("DOMContentLoaded", () => {
  const books = JSON.parse(document.getElementById('books-data').textContent);
  const TOPICS = JSON.parse(document.getElementById('topics-data').textContent);
  const resultDiv = document.getElementById('recommend-result');

  let currentTopic = "";
  let currentFiltered = [];
  let currentBook = null;

  function pickRandom() {
    if (!currentFiltered.length) return null;
    const pick = currentFiltered[Math.floor(Math.random() * currentFiltered.length)];
    return pick;
  }

  function showBook(book) {
    currentBook = book;

    resultDiv.innerHTML = `
      <div class="fade-in">
        <p class="book-title">📖 ${book.title}</p>
        <div class="recommend-actions">
          <a href="${book.href}" class="recommend-btn" target="_blank" rel="noopener">📖 Xem ngay</a>
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
      currentTopic = topic;
      const tags = TOPICS[currentTopic];
      currentFiltered = books.filter(book =>
        book.tags.some(tag => tags.includes(tag))
      );

      if (currentFiltered.length === 0) {
        resultDiv.innerHTML = '<p>Không tìm thấy sách phù hợp.</p>';
        return;
      }

      const randomBook = pickRandom();
      showBook(randomBook);
    });
  });
});