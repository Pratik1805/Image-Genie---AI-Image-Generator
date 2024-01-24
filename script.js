const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

let isIamgeGenerating = false;

const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject,index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;


        imgElement.src= aiGeneratedImg;

        imgElement.onload = () =>{
            imgCard.classList.remove("loading");  // remove loading class after the image is loaded
            //setting download attrisbute
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async(userPrompt,userImgQuantity) => { 
    try {
        //send request to the openAI API to generate images based on user input
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "1024x1024",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate images!, maybe due to improper promt or network connection,\nplease try again.")

        const { data } = await response.json(); //get data from response
        updateImageCard([...data]);
        
    } catch (error) {
        console.log(error);
    }
    finally{
        isIamgeGenerating = false
    }
}





const handleFormSubmission = (e) => {
    e.preventDefault();

    if(isIamgeGenerating) return;
    isIamgeGenerating = true;

    //get user input and image quantity from user
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    console.log(userPrompt, userImgQuantity);

    //creating HTML markup for image cards with loading state
    const imageCardMarkup = Array.from({ length: userImgQuantity }, () =>
        ` <div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imageCardMarkup;
    generateAiImages(userPrompt,userImgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission)