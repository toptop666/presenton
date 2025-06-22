<p align="center">
  <img src="readme_assets/images/presenton-logo.png" height="90" alt="Presenton Logo" />
</p>

# Open-Source, Locally-Run AI Presentation Generator (Gamma Alternative)


**Presenton** is an open-source desktop application for generating presentations with AI — all running locally on your device. Stay in control of your data and privacy while using models like OpenAI, Gemini, and others. Just plug in your own API keys and only pay for what you use.

![Demo](readme_assets/demo.gif)

## 💻📥 Download Desktop App
[Download Link](https://presenton.ai/download)


## ✨ More Freedom with AI Presentations

* ✅ **Bring Your Own Key** — Only pay for what you use. OpenAI, Gemini (More coming soon...)
* ✅ **Runs Locally** — All code runs on your device
* ✅ **Privacy-First** — No tracking, no data stored by us
* ✅ **Flexible** — Generate presentations from prompts or outlines
* ✅ **Export Ready** — Save as PowerPoint (PPTX) and PDF
* ✅ **Fully Open-Source** — Apache 2.0 licensed

## Running Presenton Docker

#### 1. Start Presenton

##### Linux/MacOS (Bash/Zsh Shell):
```bash
docker run -it --name presenton -p 5000:80 -v "./user_data:/app/user_data" ghcr.io/presenton/presenton:latest
```

##### Windows (PowerShell):
```bash
docker run -it --name presenton -p 5000:80 -v "${PWD}\user_data:/app/user_data" ghcr.io/presenton/presenton:latest
```

#### 2. Open Presenton
Open http://localhost:5000 on browser of your choice to use Presenton.

> **Note: You can replace 5000 with any other port number of your choice to run Presenton on a different port number.**

## Running electron app using source code

Before following these steps make sure [Poetry](https://python-poetry.org/docs/) is installed on your system.

#### 1. Clone this repository
```git clone https://github.com/presenton/presenton.git```

> Note: Switch to **windows_build** branch to run Presenton on Windows

#### 2. Setup Electron, Python and NextJS Environments.
```cd presenton && npm run setup:env```

#### 3. Run Presenton
```npm run dev```


## Features

### 1. Add prompt, select number of slides and language
![Demo](readme_assets/images/prompting.png)

### 2. Select theme
![Demo](readme_assets/images/select-theme.png)

### 3. Review and edit outline
![Demo](readme_assets/images/outline.png)

### 4. Present on app
![Demo](readme_assets/images/present.png)

### 5. Change theme
![Demo](readme_assets/images/change-theme.png)

### 6. Export presentation as PDF and PPTX
![Demo](readme_assets/images/export-presentation.png)

## Community
[Discord](https://discord.gg/VR89exqQ)

## configuration

configuring the server side is done via env variables

added support for cohere antropic API + liteLLM API
to choose the model you want to use set the environmental variable LLM to one of the following: "openai": chatGPT, "google": gemini, "cohere": command-A, "lite": liteLLM.
when not using liteLLM you will need to provide a API key in one of the following environmental variables:

OPENAI_API_KEY
GOOGLE_API_KEY
COHERE_API_KEY
for liteLLM supported added the following environmental variables that are needed to be defined:

LITELLM_REASONING_MODEL - name of the reasoning model to use
LITELLM_MODEL_ALIAS - name of the base model to use
LITELLM_PROXY_BASE_URL - the proxy URL liteLLM sits in
LITELLM_API_KEY - the API_KEY to liteLLM
added a environmental variable that allows to turn off image creation (will use template type 2 slide for the opening slide)

USE_IMAGES - "yes" will create images, will not otherwise
added the option to turn off the user's settings (will not be able to choose model and view API key)

NEXT_PUBLIC_SHOW_SETTINGS - "true" will allow the user to access, will not otherwise

## License

Apache 2.0

