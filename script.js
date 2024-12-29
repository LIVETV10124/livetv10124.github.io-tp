document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('channel-container');

  // Function to create a channel card
  const createCard = (channel) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.tabIndex = 0; // Makes the card focusable

    const img = document.createElement('img');
    img.src = channel.image;
    img.alt = channel.title;

    const title = document.createElement('div');
    title.classList.add('card-title');
    title.textContent = channel.title;

    card.appendChild(img);
    card.appendChild(title);
    container.appendChild(card);

    // Add event listener for DPAD navigation
    card.addEventListener('focus', () => {
      card.classList.add('focused');
    });

    card.addEventListener('blur', () => {
      card.classList.remove('focused');
    });
  };

  // Fetch channels from the playlist link
  fetch('https://la.drmlive.au/tp/playlist.php')
    .then(response => response.json())
    .then(data => {
      data.channels.forEach(channel => createCard(channel));
    })
    .catch(error => console.error('Error fetching channel data:', error));

  // Add keyboard navigation support
  document.addEventListener('keydown', (e) => {
    const focusedElement = document.querySelector('.card:focus');
    if (focusedElement) {
      let newElement;
      switch (e.key) {
        case 'ArrowRight':
          newElement = focusedElement.nextElementSibling;
          break;
        case 'ArrowLeft':
          newElement = focusedElement.previousElementSibling;
          break;
        case 'ArrowDown':
          // logic for down arrow key
          break;
        case 'ArrowUp':
          // logic for up arrow key
          break;
      }
      if (newElement) newElement.focus();
    }
  });
});
