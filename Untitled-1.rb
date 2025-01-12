
These are getting form database and sending to the AI.js and in AI.js is sending it to the worker to process 
{
  "directChat": [
    {
      "chat": [
        {
          "from": "BKc4dQugIBRf0K63AAAD",
          "chat": "I need some help sir"
        },
        {
          "to": "BKc4dQugIBRf0K63AAAD",
          "chat": "what can i do for you"
        },
        {
          "from": "BKc4dQugIBRf0K63AAAD",
          "chat": "I need to create collage project"
        },
        {
          "to": "BKc4dQugIBRf0K63AAAD",
          "chat": "okay in this type of project I can help you with some study material with that you can build your own project"
        },
        {
          "from": "BKc4dQugIBRf0K63AAAD",
          "chat": "No i really don't have time to build it own"
        },
        {
          "to": "BKc4dQugIBRf0K63AAAD",
          "chat": "so it will cost you around 1 lakh rs"
        },
        {
          "from": "BKc4dQugIBRf0K63AAAD",
          "chat": "no problem sir I will pay this amount but i need it in 7 days."
        },
        {
          "to": "BKc4dQugIBRf0K63AAAD",
          "chat": "no problem share details of your project title with me"
        }
      ]
    },
    {
      "chat": [
        {
          "from": "acOTi7ouvwdZ2QqlAAAJ",
          "chat": "can i talk to a developer"
        },
        {
          "to": "acOTi7ouvwdZ2QqlAAAJ",
          "chat": "yes you are talking to a developer"
        },
        {
          "from": "acOTi7ouvwdZ2QqlAAAJ",
          "chat": "okay so I can send you some study material regarding your project"
        },
        {
          "from": "acOTi7ouvwdZ2QqlAAAJ",
          "chat": "No sit i need you to make my project on library management software."
        },
        {
          "to": "acOTi7ouvwdZ2QqlAAAJ",
          "chat": "okay it will cost you around 1lakh rs"
        },
        {
          "from": "acOTi7ouvwdZ2QqlAAAJ",
          "chat": "can i approach you again after consenting with my team"
        },
        {
          "to": "acOTi7ouvwdZ2QqlAAAJ",
          "chat": "yap! sure apurve2014@gmail.com here is my email Id"
        }
      ]
    },
    {
      "chat": [
        {
          "from": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "Hello"
        },
        {
          "to": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "how can i help you"
        },
        {
          "from": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "need help for automating many task in my business data"
        },
        {
          "to": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "okay it will cost you 20$/hour"
        },
        {
          "from": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "No problem and can you tell me what i will pay you finally"
        },
        {
          "to": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "Provide me a copy of your false business data and write all the task you need to perform automatically point wise. apurve2014@gmail.com"
        },
        {
          "from": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "Okay give me some time to create a new data"
        },
        {
          "to": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "just be aware that data format should be same."
        },
        {
          "from": "j3ypa_vVr3Lu3clyAAAL",
          "chat": "okay sir"
        }
      ]
    }
  ],
  "chatBotChat": {
    "You need new Project": {
      "Need Consletation about your Project": {
        "Please Send your contact and title of your Project": {},
        "what is your Project About to": {
          "School Project": {},
          "Collage Project": {
            "your Project Needs Backend": {},
            "Your Project haveing Only Frontend": {},
            "You Need To Conselt About it": {
              "Contect Me on Mail": {
                "apurve@gmail.com": {}
              },
              "Continue Chat for talk to conseltent": {}
            }
          }
        }
      },
      "You know your Project Type": {
        "E-commerce website.": {},
        "Single Page WebSite": {
          "Website using React and 3rd party CSS": {
            "Tailwind": {},
            "BoootStrap": {},
            "You Suggest": {}
          },
          "Website using 3d Animation": {
            "Using Sliders": {
              "Top to Bottom": {},
              "Side to Middle": {},
              "Please Send your contact and title of your Project": {}
            },
            "Using 3d Models": {
              "Selef Created 3D Models": {
                "Block Changing Design": {
                  "Please Send your contact and title of your Project": {}
                },
                "A Design Which can rotate": {}
              },
              "Please Send your contact and title of your Project": {}
            },
            "3rd Party created Models": {
              "In diffrent formates": {},
              "In Known Formates": {}
            }
          }
        },
        "Please Send your contact and title of your Project": {}
      }
    },
    "Related Services": {
      "Please Send your contact and Provide a time to contact.": {}
    },
    "Talk to Customer Support": {
      "Technical Support": {
        "srivastavaapurve66gmail.com Please share you Query": {}
      }
    },
    "Fast Project complition": {
      "Additional cost will be charged for a custom project": {}
    }
  }
}


In worker i am seprating all the questions and answeres in diffrent arrays

And I should create an object like {"question as a key" : "Answere as the value"}

{
  "I need some help sir": "what can i do for you",
  "I need to create collage project": "okay in this type of project I can help you with some study material with that you can build your own project",
  "No i really don't have time to build it own": "so it will cost you around 1 lakh rs",
  "no problem sir I will pay this amount but i need it in 7 days.": "no problem share details of your project title with me",
  "can i talk to a developer": "yes you are talking to a developer",
  "No sit i need you to make my project on library management software.": "okay it will cost you around 1lakh rs",
  "can i approach you again after consenting with my team": "yap! sure apurve2014@gmail.com here is my email Id",
  "Hello": "how can i help you",
  "need help for automating many task in my business data": "okay it will cost you 20$/hour",
  "No problem and can you tell me what i will pay you finally": "Provide me a copy of your false business data and write all the task you need to perform automatically point wise. apurve2014@gmail.com",
  "Okay give me some time to create a new data": "just be aware that data format should be same."
}

then latter this will be used. to get all the anseres for clustred Questions.

Now I have to create cluster of Answeres.

 [
  [ 'what can i do for you', 'how can i help you' ],
  [
    'okay in this type of project I can help you with some study material with that you can build your own project',
    'no problem share details of your project title with me'
  ],
  [
    'so it will cost you around 1 lakh rs',
    'okay it will cost you around 1lakh rs'
  ],
  [ 'yes you are talking to a developer' ],
  [ 'yap! sure apurve2014@gmail.com here is my email Id' ],
  [ 'okay it will cost you 20$/hour' ],
  [
    'Provide me a copy of your false business data and write all the task you need to perform automatically point wise. apurve2014@gmail.com'
  ],
  [ 'just be aware that data format should be same.' ]
]


Then we will make pairs of question and answeres

