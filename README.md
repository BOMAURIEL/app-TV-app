
- `index.html` contains all HTML, CSS, and JavaScript.  
- Uses **Vidking Player iframe embed URLs** to stream content.

---

## ⚙️ Features

1. **Select Movies or TV Shows**  
   - Hardcoded sample library (can be updated in `mediaLibrary` in JS)  
   - TV shows allow season/episode selection

2. **Continue Watching**  
   - Saves watch progress for both movies and TV episodes in `localStorage`  
   - Resume button loads the video exactly where you left off

3. **Player Events**  
   - Displays JSON of player events in the “Player Events” section  
   - Events include `play`, `pause`, `timeupdate`, and `ended`

4. **Mobile-friendly**  
   - Fully responsive design for smartphones  
   - Touch-friendly buttons and selectors

---

## 💻 Usage

### Option 1: Open locally in a browser

1. Download the repository  
2. Open `index.html` in Chrome, Firefox, or Edge on Android or desktop  
3. Select a movie or TV show and click **Load** to start

### Option 2: Host online

1. Upload to GitHub Pages, Netlify, Firebase Hosting, or any web server  
2. Open the URL in any browser on mobile or desktop

### Option 3: Android WebView App

- Wrap `index.html` in a **WebView** using Android Studio, Cordova, or Capacitor  
- JavaScript progress tracking will work inside the WebView

---

## 🛠 Customization

- **Add new movies or TV shows** in the `mediaLibrary` object in `index.html`:

```javascript
const mediaLibrary = {
  movie: [
    { title: "Movie 1", tmdbId: 1078605 },
    { title: "Movie 2", tmdbId: 634649 }
  ],
  tv: [
    { title: "TV 1", tmdbId: 119051 },
    { title: "TV 2", tmdbId: 1412 }
  ]
};
