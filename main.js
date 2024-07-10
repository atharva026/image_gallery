const api_key = 'your_api_key';

let page = 1;

async function imageSearch() {
    let searchValue = document.getElementById('search-value').value;

    const loadMore = document.getElementById('load-more');
    const spinner = document.getElementById('spinner');
    spinner.classList.remove("hidden");

    if (searchValue == '') {
        searchValue = "all";
    }

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${searchValue}&per_page=12&client_id=${api_key}`;

    try {
        // alert(page)
        // alert(url)
        const response = await fetch(url);
        const data = await response.json();

        const imageNotFound = document.getElementById('image-not-found');
        const imagesContainer = document.getElementById('images-container');
        
        if (page == 1) {
            imagesContainer.innerHTML = '';  // Clear previous images
        }

        if (data.results.length > 0) {
            imageNotFound.classList.add('hidden');

            data.results.forEach(result => {
                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('mb-4');

                const imageElement = document.createElement('div');
                imageElement.classList.add('group', 'cursor-pointer', 'relative');

                imageElement.innerHTML = `
                    <img
                      src="${result.urls.small}"
                      alt="${result.alt_description || 'Unsplash Image'}"
                      class="w-full h-48 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                    />
                    <div class="absolute inset-0 flex justify-end items-start gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <a href="https://unsplash.com/photos/${result.id}/download?force=true" download="${result.links.slug}.png">
                            <button class="fa-solid fa-download text-white font-extrabold p-3 rounded-md outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform" style="background-color: rgba(0, 0, 0, 0.5);"></button>
                        </a>   
                        <a href="${result.links.html}" target="_blank">
                            <button class="fa-solid fa-link text-white font-extrabold p-3 rounded-md outline-none focus:ring-4 shadow-lg transform active:scale-75 transition-transform" style="background-color: rgba(0, 0, 0, 0.5);"></button>
                        </a> 
                    </div>
                `;

                const attributionElement = document.createElement('div');
                attributionElement.classList.add('text-sm', 'text-gray-500', 'mt-2');
                attributionElement.innerHTML = `
                    Photo by <a href="${result.user.links.html}" target="_blank" class="underline">${result.user.name}</a> on <a href="https://unsplash.com" target="_blank" class="underline">Unsplash</a>
                `;


                imageWrapper.appendChild(imageElement);
                imageWrapper.appendChild(attributionElement);
                imagesContainer.appendChild(imageWrapper);
            });
            spinner.classList.add("hidden");

            if (data.total_pages == page) {
                loadMore.classList.add('hidden');
            } else {
                loadMore.classList.remove('hidden');
            }
            
        } else {
            spinner.classList.add("hidden");
            loadMore.classList.add('hidden');
            imageNotFound.classList.remove('hidden');
        }
    } catch (error) {
        spinner.classList.add("hidden");

        const imageNotFound = document.getElementById('image-not-found');
        loadMore.classList.add('hidden');
        imageNotFound.classList.remove('hidden');
    }
}

document.querySelector('#search button').addEventListener('click', (event) => {
    event.preventDefault();
    page = 1;
    imageSearch();
});


document.querySelector('#load-more button').addEventListener('click', () => {
    ++page;
    imageSearch();
})