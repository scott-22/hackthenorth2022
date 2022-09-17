import './App.css';

function App() {
  return (
    <div class="html-body">

      <div class="header-container" id="home-div">
        <button class="header-text" onClick="document.getElementById('home-div').scrollIntoView();">Home</button>
        <button class="header-text" onClick="document.getElementById('about-div').scrollIntoView();">Graphs</button>
        <button class="header-text" onClick="document.getElementById('portfolio-div').scrollIntoView();">About Us</button>
        <button class="header-text" onClick="document.getElementById('portfolio-div').scrollIntoView();">Contacts</button>
      </div>

    </div>
  );
}

export default App;
