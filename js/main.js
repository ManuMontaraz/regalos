const _GIANT_KEY_ = "fe525390f067e9ff705c8bec5205978f07110195"
const _CORS_ANYWHERE_ = "https://cors-anywhere.herokuapp.com/";

document.addEventListener("DOMContentLoaded", () => {
	//inicio();
	init()
})

function init(){
	
	const ContainerForm = document.querySelector("#containerForm")
	const ContainerGift = document.querySelector("#containerGift")
	
	document.forms["giftForm"].addEventListener("submit",send_gift)

	if(location.search){
		set_game()
		ContainerGift.classList.add("active")
		ContainerForm.classList.add("hide")
	}else{
		ContainerForm.classList.add("active")
		ContainerGift.classList.add("hide")
	}
}

function set_game(){
	const ElementName = document.querySelector("#name_gift")
	const ElementImage = document.querySelector("#image_gift")
	const ElementKey = document.querySelector("#key_gift")

	const Searches = get_search()

	if(Searches.name)ElementName.textContent = Searches.name
	if(Searches.image)ElementImage.src = Searches.image
	if(Searches.key)ElementKey.textContent = Searches.key
	
	console.log(Searches)
}

function get_search(){

	const Searches = location.search.slice(1).split("&")
	let undecodedSearch = []

	for(let indexSearches = 0 ; indexSearches < Searches.length ; indexSearches++){
		const Search = Searches[indexSearches].split("=")
		const Name = Search[0].replaceAll("*","=").trim()
		const Content = atob(Search[1].replaceAll("*","=")).trim()
		undecodedSearch[Name] = Content
	}

	return undecodedSearch
}

function update_image(){
	const ElementImage = document.querySelector("#image_game")
	const ElementUrlImage = document.querySelector("#image")

	ElementImage.classList.remove("no_portrait")
	try{
		ElementImage.src = ElementUrlImage.value
		const ElementSearchGame = document.querySelector("#search_game")
		ElementSearchGame.classList.remove("active")

	}
	catch(error){
		alert(error)
		ElementImage.classList.add("no_portrait")
	}
}

function error_update_image(element){
	element.classList.add('no_portrait')
}

function search_games(){
	const Debug = true
	
	const ElementSearch = document.querySelector("#name")
	const ElementSearchGames = document.querySelector("#search_game")
	const UrlAPI = `${Debug?_CORS_ANYWHERE_:""}https://www.giantbomb.com/api/search/?api_key=${_GIANT_KEY_}&format=json&field_list=name,guid,image&resources=game&query=${ElementSearch.value}`
	
	console.log(UrlAPI)

	const Search = ElementSearch.value
	if(Search){
		fetch(UrlAPI, {
			method: 'GET',
			headers: new Headers({
				'Content-Type': 'application/json',
				'User-Agent': "RegalitosAPP"
			})
		})
		.then(resp=>resp.json())
		.then(jsonGames=>{
			console.log("jsonGames",jsonGames)
			console.log("jsonGames.results",jsonGames.results)
			const Result = jsonGames.results
			//jsonGames.results
			let html = ""
			for(let indexGames = 0 ; indexGames < Result.length ; indexGames++){
				const Game = Result[indexGames]
				const Name = Game.name
				const Image = Game.image.small_url
				html += `<li><button onclick="selected_game('${Name}','${Image}')">${Name}</button></li>`
			}
			ElementSearchGames.innerHTML = html

			ElementSearchGames.classList.add("active")
		})
	}else{
		ElementSearchGames.classList.remove("active")
	}
}

function selected_game(name,image){
	const ElementName = document.querySelector("#name")
	const ElementImage = document.querySelector("#image")

	ElementName.value = name
	ElementImage.value = image

	update_image()

}

function send_gift(){
	event.preventDefault()
	const Form = document.forms["giftForm"]
	const Name = Form.name
	const Image = Form.image
	const Key = Form.key

	if(!Name.value || !Key.value)return
	const Search = `?name=${btoa(Name.value.replaceAll("=","*"))}${Image.value?`&image=${btoa(Image.value.replaceAll("=","*"))}`:""}&key=${btoa(Key.value.replaceAll("=","*"))}`
	//Form.submit();

	const URL = `${location.href}${Search}`
	alert("Se ha copiado algo en el portapapeles")
	navigator.clipboard.writeText(URL)
}

function open_gift(){
	const AudioTrompeta = new Audio('./media/trompetita.m4a')
	const AudioAplauso = new Audio('./media/aplauso.m4a')

	const ElementGift = document.querySelector("#gift")
	const ElementKey = document.querySelector("#key_gift")

	if(ElementGift.classList.contains("open")){

		alert("Se ha copiado algo en el portapapeles")
		navigator.clipboard.writeText(ElementKey.textContent)

	}else{
		AudioTrompeta.play()

		ElementGift.classList.add("open")
	
		setTimeout(()=>{
			AudioAplauso.play()
		},2000)
	}
}

function cifraCodigo(elCodigo){
	var codigoCifrado = "";
	for (var i = 0 ; i < elCodigo.length ; i++){
		codigoCifrado = codigoCifrado+elCodigo[i]+"@"+getRandomInt(0, 9)+getRandomInt(0, 9)+getRandomInt(0, 9)+"@";
	}
	return codigoCifrado;
}

function descifraCodigo(elCodigoCifrado){	
	var codigoDescifrado = "";
	for (var i = 0 ; i < elCodigoCifrado.split("%40").length ; i++){
		if (i % 2 == 0){
			codigoDescifrado = codigoDescifrado+elCodigoCifrado.split("%40")[i];
		}
	}
	return codigoDescifrado;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}