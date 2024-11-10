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

	if(Searches.name)ElementImage.textContent = Searches.name
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

function search_games(){
	const Debug = false
	
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
				'Access-Control-Allow-Origin': '*',
				'User-Agent': "Regalitos APP"
			}),
		})
		.then(resp=>resp.json())
		.then(jsonGames=>{
			console.log(jsonGames.results)
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
		.catch(error=>console.error(error))
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

function inicio(){
	var regalo = document.getElementById("regalo").children[0];
	var enviarCodigo = document.getElementById("enviarCodigo");
	var formularioCodigo = document.getElementById("formularioCodigo");
	var codigo = "PRUEBA-PRUEBA-PRUEBA";
	var audioTrompeta = new Audio('./media/trompetita.m4a');
	var audioAplauso = new Audio('./media/aplauso.m4a');
	
	/*$.ajax({
		url : "./codigo.txt",
		dataType: "text",
		success : function (data) {
			codigo = data;
		}
	});*/
	
	if (document.location.search == ""){
		formularioCodigo.style.display="block";
		regalo.parentElement.style.display="none";
	} else {
		codigo = document.location.search.split("?").toString().replace(",","").split("&")[0];
		codigo = codigo.split("=")[1].toString();
		//console.log(codigo);
		//codigo = cifraCodigo(codigo);
		//console.log(codigo);
		codigo = descifraCodigo(codigo);
		//console.log(codigo);
	}
	
	enviarCodigo.addEventListener('click', function(){
		console.log("a");
		document.getElementById("codigo").value = cifraCodigo(document.getElementById("codigo").value);
		document.forms["formularioCodigo"].submit();
	});
	
	regalo.addEventListener('click', function(){
		if (regalo.children[0].style.opacity == "0") {
			navigator.clipboard.writeText(codigo);
			if (regalo.parentElement.children.length <= 1){
				regalo.insertAdjacentHTML('afterend', '<div class="codigo">'+codigo+'</div><a href="https://store.steampowered.com/account/registerkey?key='+codigo+'" target="_blank" class="codigo">CANJEAR EN STEAM</a>');
				setTimeout(function(){
					alert("SE HA COPIADO ALGO EN EL PORTAPAPELES");
				}, 300);
			}else{
				alert("SE HA COPIADO EL CÓDIGO EN EL PORTAPAPELES");
			}
		}else{
			regalo.children[0].style.opacity = "0";
			audioTrompeta.play();
			navigator.clipboard.writeText(codigo);
			setTimeout(function(){
				audioAplauso.play(); 
			}, 1500);
		}
	});
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