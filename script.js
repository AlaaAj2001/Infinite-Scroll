const gifWindow = document.getElementById('gifWindow');
const triangle = document.getElementById('triangle');
const openGIFWindowBtn = document.getElementById('openGIFWindowBtn');
const gifContainer = document.getElementById('gifContainer');
const searchInput = document.querySelector('.gif-window input[type=text]');
const loadingSpinner = document.getElementById('loadingSpinner');
var page = 0;
const API_KEY = 'zu9ERYECic4uci9TYt3n7QqnkWPpi4Pf';

async function fetchGIFs(offset = 0) {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=10&rating=g&offset=${offset}`);
    const data = await response.json();
    const gifURLs = data.data.map(gif => gif.images.original.url);
    return gifURLs;
  } catch (error) {
    console.error('Error fetching GIFs:', error);
  }
}

async function fetchGIFsFromSearch(offset = 0, searchQuery) {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=${API_KEY}&limit=10&rating=g&offset=${offset}`);
    const data = await response.json();
    const gifURLs = data.data.map(gif => gif.images.original.url);
    return gifURLs;
  } catch (error) {
    console.error('Error fetching GIFs:', error);
  }
}

async function generateGIFs(offset = 0) {
  const gifURLs = await fetchGIFs(offset);
  gifURLs.forEach(url => {
    const gifItem = document.createElement('li');
    gifItem.classList.add('gif-item');
    const img = document.createElement('img');
    img.src = url;
    gifItem.appendChild(img);
    gifContainer.appendChild(gifItem);

    gifItem.addEventListener('click', () => {
      displayBigImg(url);
    });
  });
}

function displayBigImg(url){
  const div = document.createElement('div');
  div.classList.add('big-img-div');
  const selectedImg = document.createElement('img');
  selectedImg.src = url;
  div.appendChild(selectedImg);
  document.body.appendChild(div);
  
  div.addEventListener('click', () => {
    document.body.removeChild(div);
    event.stopPropagation();
  });
}

async function generateGIFsFromSearch(offset = 0, searchQuery) {
  const gifURLs = await fetchGIFsFromSearch(offset, searchQuery);
  gifURLs.forEach(url => {
    const gifItem = document.createElement('li');
    gifItem.classList.add('gif-item');
    const img = document.createElement('img');
    img.src = url;
    gifItem.appendChild(img);
    gifContainer.appendChild(gifItem);

    gifItem.addEventListener('click', () => {
     displayBigImg(url);
    });
  });
}

openGIFWindowBtn.addEventListener('click', async (event) => {
  if(gifWindow.style.display === 'block'){
    gifWindow.style.display = 'none';
    triangle.style.display = 'none';
  }
  else{
    loadingSpinner.style.display = 'block';
    const searchQuery = searchInput.value.trim();
    gifContainer.innerHTML = ''; 
    page = 0;
    if(searchQuery !== '') { 
      await generateGIFsFromSearch(0, searchQuery);
    } else {
      await generateGIFs(0);  
    } 
    loadingSpinner.style.display = 'none';
    gifWindow.style.display = 'block';
    triangle.style.display = 'block';
  }
});

searchInput.addEventListener('input', async () => {
  loadingSpinner.style.display = 'block';
  const searchQuery = searchInput.value.trim();
  gifContainer.innerHTML = '';
  page = 0;
  if (searchQuery !== '') { 
    await generateGIFsFromSearch(0, searchQuery);
  } else {
    await generateGIFs(0);  
  } 
  loadingSpinner.style.display = 'none';
  gifWindow.style.display = 'block';
  triangle.style.display = 'block';
});

gifWindow.addEventListener('scroll', async () => {
  const { scrollTop, scrollHeight, clientHeight } = gifWindow;
  if (scrollTop + clientHeight >= scrollHeight) {
    const searchQuery = searchInput.value.trim();
    if(searchQuery !== '') { 
      await generateGIFsFromSearch((page + 1) * 10, searchQuery);
    } else {
      await generateGIFs((page + 1) * 10);  
    } 
    page++;
  }
});

document.addEventListener('click', (event) => {
  if (!gifWindow.contains(event.target) && event.target !== openGIFWindowBtn) {
    gifWindow.style.display = 'none';
    triangle.style.display = 'none';
  }
});


