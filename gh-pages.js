import { publish } from 'gh-pages';

publish(
    'dist', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/JAsaxon/ConnectFour', // Update to point to your repository  
        user: {
            name: 'jorge saxon', // update to use your name
            email: 'jorgesaxon1234@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)