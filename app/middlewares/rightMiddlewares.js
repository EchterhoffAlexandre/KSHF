function isLoggedInMiddleware(requete,reponse,next)
{

    if(typeof requete.session.user == 'undefined' || !requete.session.user)
    {
        reponse.redirect("/")
    }
    next()
}

function isAdminMiddleware(requete,reponse,next)
{
    console.log("ROLE DU USER : " + requete.session.user.role + " NOM " + requete.session.user.firstname)

    if(requete.session.user.role != "admin")
    {
        reponse.redirect("/")
    }
    next()
}

module.exports = { isLoggedInMiddleware,isAdminMiddleware }











                                















