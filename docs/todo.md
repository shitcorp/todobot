# /todo
> Create a new TODO object 

# Arguments

| Name | Description | Type | Required? | 
| :-- | :-- | :-- | :-- | 
| title | Title of the TODO object | String (Text) | ✔️ | 
| tasks | The tasks that belong to this todo. Seperate them with a semicolon (;). Maximum 10 tasks allowed! | String (Text) | ❌ | 
| content | Content of the TODO object | String (Text) | ❌ | 
| url | Attach a link to the todo | String (Text) | ❌ | 
| image | Attach an image to the todo. Has to be a discord attachment link. | String (Text) | ❌ | 
| category | The category this todo should belong to. | String (Text) | ❌ | 
| loop | Create repeating tasks | Boolean (true or false) | ❌ | 



# Images & Attachments
If you want to attach an image to your task, you can simply upload an image and give it a title like so: {{thisismytitle}} ("thisismytitle" will then be the title to reference). 


When creating your task then reference the image with your title in the image options. The image will then be embedded into your todo list. **Note:** The image will be available 24hrs after uploading (for every guild member). This is due to the bot caching the links to images that are uploaded with the special tags (the double curly brackets {{}}).


For attaching normal links, just put them in the url option, if will then be shown as attachment in your todo list.

 [🔙 Go back](../)