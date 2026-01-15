

let typeData = null;
// an async function that ensures first the data is fetched from the api

// a function that fetches data from any pokeAPI url
async function fetchData(url){
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


// function for getting the array of pokemon type names
async function fetchPokeTypeName(url){
    let data = await fetchData(url);
    //setting the typeData global variable value as the arr of json objects having typeName and the related url keys
    typeData = data["results"];

    let pokeTypeNames = [];
    for(let i=0; i<=(typeData.length-1); i++){
        let pokeTypeName = typeData[i]["name"];
        pokeTypeNames.push(pokeTypeName);
    }
    return pokeTypeNames;  
};

//function for creating option tags for pokemon types
function creatingOptionTag(value){
    const optionTag = document.createElement("option");
    const modifiedValue= value.charAt(0).toUpperCase() + value.slice(1);
    optionTag.innerHTML = modifiedValue;
    optionTag.setAttribute("value", value);
    return optionTag;
};

//defining async function for creating selector section
async function createPokeSelector(){
    const pokemonTypes = await fetchPokeTypeName("https://pokeapi.co/api/v2/type/");

    const selectTag = document.createElement("select");
    selectTag.setAttribute("name", "type");
    selectTag.setAttribute("id", "type");

    for(let i=0; i<=(pokemonTypes.length-1); i++){
    let optionTag = creatingOptionTag(pokemonTypes[i]);
    selectTag.appendChild(optionTag);
    }


    const selectorContainerDiv = document.querySelector("#selectorContainerDiv");
    selectorContainerDiv.appendChild(selectTag);
}
//calling the above async function to create the selector section for displaying pokemon types
createPokeSelector();


//function for getting the pokemons of a certain type



async function generatePokemonCards(){
    let typeOfPokemon = finalizingType();
    let numOfCards = document.querySelector("input").value;
    // call a function here that fetches the right type of pokemons and of a certain number
    let obtainedPokemons = await findingPokemons(typeOfPokemon, numOfCards);
    // call a function that renders the name and image of all the obtained pokemons
    // on the DOM
    
    renderNameImageAbilities(obtainedPokemons);
    
}

//function for finding the relevant type pokemons
async function findingPokemons(type, numOfCards){
    let pokemonTypeData = typeData;
    let relevantUrl = null;
    for(let i=0; i<= (pokemonTypeData.length-1); i++){
        if(type==pokemonTypeData[i]["name"]){
            const relevantPokemonType = pokemonTypeData[i];
            relevantUrl = relevantPokemonType["url"];
        }  
    }   
    //fetching the data of that particular pokemon type using the above url
    let particularPokemonTypeData = await fetchData(relevantUrl);

    /* getting pokemon array that contains 
    all the data of all the pokemons of that part type
    */
    let particularTypePokemonsData = particularPokemonTypeData["pokemon"];
    
    // selecting only the required number of pokemon (their related data actually)
    // but in a random fashion
    //Here we created an array of length of required cards
    //where each element of the array is generated randomly
    let requiredRandomNums = requiredNumberOfRandomNumbers(numOfCards, particularTypePokemonsData);

    //call a function that returns the relevant pokemon urls along with pokemon names
    let requiredNamesAndUrls = requiredPokemonUrls(requiredRandomNums, particularTypePokemonsData);

    //call a function that goes to the given url and fetches the PokemonImage
    let relevantNameAndImages = await nameAndImage(requiredNamesAndUrls);
    
    return relevantNameAndImages;
    
}


//function for finalizing the type
function finalizingType(){
    let finalType = document.querySelector("#type").value;
    return finalType
}

//function for generating random integer between certain values (inclusive)
function getRandomCardNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function for generating required number of random numbers
 function requiredNumberOfRandomNumbers(num,particularTypePokemonsData){
    const randomNums = [];
    for(let i=0; i<num; i++){
        randomNums.push(getRandomCardNumber(1, particularTypePokemonsData.length))
    }
    return randomNums;
 }

 // function that returns the required pokemons urls
 function requiredPokemonUrls(requiredRandomNums, particularTypePokemonsData) {
    return requiredRandomNums.map(index => {
        // Ensure index is within bounds (subtract 1 if your random generator is 1-based)
        const pokemonEntry = particularTypePokemonsData[index - 1]; 
        return {
            name: pokemonEntry["pokemon"]["name"],
            url: pokemonEntry["pokemon"]["url"]
        };
    });
}

    // function that fetches images of the pokemons
    async function nameAndImage(requiredNamesAndUrls){
    let nameAndImage = [];
    for(let i=0; i<= (requiredNamesAndUrls.length-1); i++){
        let nameOfPokemon = requiredNamesAndUrls[i]["name"];
        let pokemonData = await fetchData(requiredNamesAndUrls[i]["url"])
        let pokemonImage = pokemonData["sprites"]["other"]["showdown"]["front_default"];
        let pokemonAbilitiesArr = pokemonData["abilities"];
        pokemonAbilitiesArr = (pokemonAbilitiesArr.map((currentValue)=>
            currentValue["ability"]["name"]
        ));
        

        nameAndImage.push(
            {
            "pokemonName": nameOfPokemon,
            "pokemonImage": pokemonImage,
            "pokemonAbilities": pokemonAbilitiesArr
        }
    );
    }
    return nameAndImage;
};

// function that renders the Name and Image of pokemon on DOM
function renderNameImageAbilities(obtainedPokemons){
        let cardsContainerDiv = document.querySelector("#cardsContainerDiv");
        cardsContainerDiv.parentNode.removeChild(cardsContainerDiv);
        let newCardsContainerDiv = document.createElement("div");
        newCardsContainerDiv.setAttribute("id", "cardsContainerDiv");
        for(let i=0; i<=(obtainedPokemons.length-1); i++){
            let pokeName = obtainedPokemons[i]["pokemonName"];
            let pokeImage = obtainedPokemons[i]["pokemonImage"];
            let pokeAbilities = obtainedPokemons[i]["pokemonAbilities"];
            pokeAbilities = pokeAbilities.join(", ")
            let pokemonInfoHolderDiv = document.createElement("div");
            pokemonInfoHolderDiv.setAttribute("id", "pokemonInfoHolderDiv");
            let pokemonNameDiv = document.createElement("div");
            pokemonNameDiv.setAttribute("id", "pokemonName")
            pokemonNameDiv.innerHTML = pokeName;
            let pokemonImgTag = document.createElement("img");
            pokemonImgTag.setAttribute("src", `${pokeImage}`);
            pokemonImgTag.setAttribute("alt", "image description");
            pokemonImgTag.setAttribute("id", "pokemonImage");
            let labelAndAbilityContainerDiv = document.createElement("div");
            labelAndAbilityContainerDiv.setAttribute("id", "labelAndAbilityContainerDiv")
            let abilitiesLabelSpan = document.createElement("span");
            abilitiesLabelSpan.setAttribute("id", "abilitiesLabel");
            abilitiesLabelSpan.innerHTML = "Abilities: ";
            let pokeAbilitiesSpan = document.createElement("span");
            pokeAbilitiesSpan.innerHTML = pokeAbilities;
            pokemonInfoHolderDiv.appendChild(pokemonImgTag);
            pokemonInfoHolderDiv.appendChild(pokemonNameDiv);
            labelAndAbilityContainerDiv.appendChild(abilitiesLabelSpan)
            labelAndAbilityContainerDiv.appendChild(pokeAbilitiesSpan)
            pokemonInfoHolderDiv.appendChild(labelAndAbilityContainerDiv);
            newCardsContainerDiv.appendChild(pokemonInfoHolderDiv);
            document.querySelector("#parentOfContainer").appendChild(newCardsContainerDiv);
        }
    }
