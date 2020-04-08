const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMaker").animate({width:'hide'}, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr('action'), $("#domoForm").serialize(), function(){
        loadDomosFromServer();
    });

    return false;
};

const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={handleDomo}
            action='/maker'
            method='POST'
            className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name' />
            <label htmlFor = "age">Age: </label>
            <input id="domoAge" type='text' name='age' placeholder='Domo Age'/>
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type='text' name='level' placeholder=' Domo Level' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeDomoSubmit' type='submit' value='Make Domo' />
        </form>
    );
};

const handleLevel = (e) => {
    e.preventDefault();

    $("#domoMaker").animate({width:'hide'}, 350);

    // change what happens depending on the active element

    if ($("#domoSearchName").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    // (if time) code here to change action to /delete instead of /level
    // code server side for deleting element from database

    sendAjax('POST', $("#domoLevel").attr('action'), $("#domoLevel").serialize(), function(){
        loadDomosFromServer();
    });

    //console.log(document.activeElement.name);

    return false;
};

// add code for leveling up a Domo (and if time delete)
const DomoLevel = (props) => {
    return (
        <form id='domoLevel'
        onSubmit={handleLevel}
        action='/level'
        method='POST'
        className="domoLevel">
            <label htmlFor='name'>Name: </label>
            <input id='domoSearchName' type='text' name='name' placeholder='Domo Name' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='makeDomoSubmit' type='submit' value='Level Domo' name="leveler" />
            {/* <input className='makeDomoSubmit' type='submit' value='Delete Domo' name='deleter' /> */}
        </form>
    );
};

const DomoList = (props) => {
    if(props.domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function (domo) {
        return (
            <div key={domo._id} className='domo'>
                <img src='/assets/img/domoface.jpeg' alt="domo face" className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'> Age: {domo.age}</h3>
                <h3 className='domoLevel'>Level: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () =>{
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />,
            document.querySelector("#domos")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <DomoForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoLevel csrf={csrf}/>, document.querySelector("#levelDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});