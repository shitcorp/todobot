# /reminder
> Create, edit and view reminders 

# Subcommands

## /reminder create 

| Name | Description | Type | Required? | 
| :-- | :-- | :-- | :-- | 
| time | After this timespan you will be reminded. | Number (0, 1, 2, 3, 4 ...) | ✔️ | 
| unit | Minutes? Hours? Seconds? Choose now. | String (Text) | ✔️ | 
| content | Reminder Text that will be shown when the reminder expires. | String (Text) | ✔️ | 
| participants | Choose another user or users that should also be reminded. | User | ❌ | 
| participatingRoles | Choose a role that should be reminded. | Role | ❌ | 
## /reminder view 

No arguments required. Description: 
> View your reminder(s). 

