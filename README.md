# sonarqube
Kaholo Plugin for SonarQube
This plugin is wrapping SonarQube CLI. 


## Settings
### Parameters
1) Token
## Method: Create Project
This method will create a new project.
## Method: Search Users 
This method will search users.

Both methods are wrapping SonarQube RestAPI.

### Parameters:

#### Create Project
1) Home URL: the URL to the SonarQube server. For exaple: http://localhost:9000 ```Required```
2) Project Name: Name of the project. If name is longer than 500, it is abbreviated. ```Required```
3) Organization: The key of the organization.```Required```
4) Project Key: Key of the project **Maximum length 400.** ```Required```
5) Visability: Whether the created project should be visible to everyone, or only specific user/groups. 
If no visibility is specified, the default project visibility of the organization will be used.**Possible values private and public** ```Optional```


#### Search Users 
1) Home URL: the URL to the SonarQube server. For exaple: http://localhost:9000 ```Required```
2) Page number: 1-based page number. **Default value 1**.  ```Optional```
3) Page size(limit): Page size (limit). Must be greater than 0 and less or equal than 500. **Default value 50**.```Optional```
4) Search text: Search text. Filter on login, name and email. **Minimum length 2**. ```Optional```