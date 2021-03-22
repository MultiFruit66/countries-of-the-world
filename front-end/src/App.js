/* eslint-disable */
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useParams
} from "react-router-dom";

const authInfo = {
  isAuthenticated: localStorage.getItem('jwt') ? true : false,
  data: JSON.parse(localStorage.getItem('data')) || {},
  jwt: localStorage.getItem('jwt') || false
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      show_header: false,
      path: '/'
    }
  }

  toggleHeader = (toggle) => {
    this.setState({ show_header: toggle });
  }

  changePath = (path) => {
    this.setState({ path })
  }

  render() {
    return (
      <Router>
        {this.state.show_header ? <Header path={this.state.path} /> : ""}
        <Switch>
          <Route exact path="/">
            <MainPage changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </Route>
          <Route path="/login">
            <LoginPage changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </Route>
          <Route path="/register">
            <RegisterPage changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </Route>
          <PrivateRoute path="/post/create">
            <CreatePost changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </PrivateRoute>
          <PrivateRoute path="/country/create">
            <CreateCountry changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </PrivateRoute>
          <PrivateRoute path="/city/create">
            <CreateCity changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </PrivateRoute>
          <PrivateRoute path="/nation/create">
            <CreateNation changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </PrivateRoute>
          <PrivateRoute path="/lang/create">
            <CreateLang changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </PrivateRoute>
          <PrivateRoute path="/city/:cityid" children={<EditCity changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />} />
          <PrivateRoute path="/nation/:nationid" children={<EditNation changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />} />
          <PrivateRoute path="/lang/:langid" children={<EditLang changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />} />
          <PrivateRoute path="/country/:countryid" children={<EditCountry changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />} />
          <PrivateRoute path="/user/:userid/edit" children={<EditUser changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />} />
          <PrivateRoute path="/post/:postid/edit" children={<EditPost changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />} />
          <Route path="/user/:userid">
            <UserPage changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </Route>
          <Route path="/post/:postid">
            <PostPage changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </Route>
          <Route path="*">
            <NotFound changePath={this.changePath} showHeader={this.toggleHeader} header={this.state.show_header} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      login: '',
      password: '',
      redirect: false
    }
    this.loading = false;
    if(this.props.header === true) this.props.showHeader(false);
  }

  componentDidMount(){
    this.props.changePath('/login');
  }

  handleSubmit = async(e) => {
    e.preventDefault();
    this.loading = true;
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'auth.login',
      params: {
        username: this.state.login,
        pass: this.state.password
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    this.loading = false;
    if(!jsonRPCResponse) return;
    authInfo.isAuthenticated = true;
    authInfo.data = jsonRPCResponse.result.db;
    authInfo.jwt = jsonRPCResponse.result.jwt;
    localStorage.setItem('data', JSON.stringify(authInfo.data));
    localStorage.setItem('jwt', authInfo.jwt);
    this.setState({ redirect: true });
  }

  changeLogin = (e) => {
    this.setState({login: e.target.value});
  }

  changePassword = (e) => {
    this.setState({password: e.target.value});
  }

  render() {
    return (
      <form id="loginForm" onSubmit={this.handleSubmit}>
        <div className="login-title">Авторизация</div>
        <div className='login-group'>
          <input type="text" placeholder="Ваш логин" onChange={this.changeLogin} value={this.state.login} />
          <div className="login-label">Логин</div>
          <div className="input-active"></div>
          <div className="input-active-moving"></div>
        </div>
        <div className='login-group'>
          <input type="password" placeholder="Ваш пароль" onChange={this.changePassword} value={this.state.password} />
          <div className="login-label">Пароль</div>
          <div className="input-active"></div>
          <div className="input-active-moving"></div>
        </div>
        <div className="login-group button-group">
          <button className="button-table" type="submit">Войти</button>
        </div>
        <div className="reg-button-log"><Link to="/register" from='/login'>Нет аккаунта? Зарегистрируйтесь</Link></div>
        {this.state.redirect ? <Redirect to={{ pathname: "/", state: { from: '/login' } }} /> : ''}
        {authInfo.isAuthenticated ? <Redirect to={{ pathname: "/", state: { from: '/login' } }} /> : ''}
      </form>
    );
  }
}

class RegisterPage extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === true) this.props.showHeader(false);
    this.state = {
      email: '',
      username: '',
      name: '',
      surname: '',
      pass: '',
      redirect: '',
      importform: false
    }
  }

  componentDidMount(){
    this.props.changePath('/register');
  }

  handleSubmit = async(e) => {
    e.preventDefault();
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'auth.register',
      params: {
        username: this.state.username,
        email: this.state.email,
        name: this.state.name,
        surname: this.state.surname,
        pass: this.state.pass,
        avatar: 'https://i.imgur.com/85GtiDX.jpg'
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse) return;
    notify('Вы успешно зарегистрированы!');
    authInfo.isAuthenticated = true;
    authInfo.data = {
      uId: jsonRPCResponse.id,
      uUsername: this.state.username,
      uEmail: this.state.email,
      uName: this.state.name,
      uSurname: this.state.surname,
      uAdmin: 0,
      uPass: this.state.pass,
      uAvatar: 'https://i.imgur.com/85GtiDX.jpg'
    };
    authInfo.jwt = jsonRPCResponse.jwt;
    console.log(JSON.stringify(authInfo));
    localStorage.setItem('data', JSON.stringify(authInfo.data));
    localStorage.setItem('jwt', authInfo.jwt);
    this.setState({ redirect: <Redirect to={{ pathname: "/", state: { from: '/register' } }} /> });
  }

  render() {
    return (
      <form id="loginForm" onSubmit={this.handleSubmit}>
        {this.state.redirect}
        <div class="login-title">Регистрация</div>
        <div class='login-group'>
          <input type="text" placeholder="Введите логин" onChange={(e) => this.setState({username: e.target.value})} value={this.state.username} />
          <div class="login-label">Логин</div>
          <div class="input-active"></div>
          <div class="input-active-moving"></div>
        </div>
        <div class='login-group'>
          <input type="text" placeholder="Введите почту" onChange={(e) => this.setState({email: e.target.value})} value={this.state.email} />
          <div class="login-label">Электронная почта</div>
          <div class="input-active"></div>
          <div class="input-active-moving"></div>
        </div>
        <div class='login-group'>
          <input type="text" placeholder="Введите имя" onChange={(e) => this.setState({name: e.target.value})} value={this.state.name} />
          <div class="login-label">Имя</div>
          <div class="input-active"></div>
          <div class="input-active-moving"></div>
        </div>
        <div class='login-group'>
          <input type="text" placeholder="Введите фамилию" onChange={(e) => this.setState({surname: e.target.value})} value={this.state.surname} />
          <div class="login-label">Фамилия</div>
          <div class="input-active"></div>
          <div class="input-active-moving"></div>
        </div>
        <div class='login-group'>
          <input type="password" placeholder="Введите пароль" onChange={(e) => this.setState({pass: e.target.value})} value={this.state.pass} />
          <div class="login-label">Пароль</div>
          <div class="input-active"></div>
          <div class="input-active-moving"></div>
        </div>
        <div class="login-group button-group">
          <button class="button-table" type="submit">Зарегистрироваться</button>
        </div>
        <div className="reg-button-log"><Link to="/login" from='/register'>Уже есть аккаунт? Используйте авторизацию</Link></div>
        {authInfo.isAuthenticated ? <Redirect to={{ pathname: "/", state: { from: '/register' } }} /> : ''}
      </form>
    );
  }
}

class MainPage extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      show_loader: true,
      data: [],
      search: '',
      select: 'date',
      likes: [],
      redirect: ''
    }
  }

  async componentDidMount() {
    this.props.changePath('/');
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'post.get',
      params: {
        filter: {},
        sort: { pId: 'DESC' },
        limit: 10
      },
      id: Math.floor(Date.now() / 1000)
    }
    let jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      return;
    }
    this.setState({ data: jsonRPCResponse.result });
    if(authInfo.isAuthenticated){
      jsonRPCRequest.method = "like.get";
      jsonRPCRequest.params = {
        filter: { likeUser: authInfo.data.uId },
        sort: {},
        limit: 0
      };
      jsonRPCResponse = await sendRequest(jsonRPCRequest);
      if(jsonRPCResponse){
        let array = [];
        for(let i in jsonRPCResponse.result){
          array.push(jsonRPCResponse.result[i].likePost);
        }
        this.setState({ likes: array });
      }
    }
    this.setState({ show_loader: false });
  }

  changeSelect = async(e) => {
    this.setState({ select: e.target.value });
    if(this.state.select == "date"){
      this.state.data.sort((a, b) => a.pId - b.pId);
    }
    else if(this.state.select == '-date'){
      this.state.data.sort((a, b) => b.pId - a.pId);     
    }
    else if(this.state.select == 'level'){
      this.state.data.sort((a, b) => a.pCountry - b.pCountry);     
    }
    else if(this.state.select == '-level'){
      this.state.data.sort((a, b) => b.pCountry - a.pCountry);     
    }
  }

  importData = () => {
    this.setState({ importform: !this.state.importform });
  }

  fileUpload = async(e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = async() => {
      let jsonData;
      try {
        jsonData = JSON.parse(reader.result);
        if(!jsonData.type || !jsonData.data) throw new Error('Неверный тип данных!');
      } catch(e) {
        notify('Неверный формат данных!');
        this.importData();
        return;
      }
      const jsonRPCRequest = {
        jsonrpc: '2.0',
        method: 'data.upload',
        params: {
          type: jsonData.type,
          data: jsonData.data
        },
        id: Math.floor(Date.now() / 1000)
      }
      const jsonRPCResponse = await sendRequest(jsonRPCRequest);
      if(!jsonRPCResponse){
        return this.importData();
      }
      if(jsonRPCResponse.result.message) notify(jsonRPCResponse.result.message)
      this.setState({ redirect: <Redirect to={{ pathname: "/post/"+jsonRPCResponse.result.post, state: { from: '/' } }} /> })
      this.importData();
    }
    reader.readAsText(file);
  }

  like = async(postid) => {
    let jsonRPCRequest;
    if(this.state.likes.includes(postid)){
      let arr = this.state.likes.slice();
      arr.splice(this.state.likes.indexOf(postid), 1);
      this.setState({ likes: arr });
      jsonRPCRequest = {
        jsonrpc: '2.0',
        method: 'like.unset',
        params: {
          post: postid
        },
        id: Math.floor(Date.now() / 1000)
      }
    } else {
      let arr = this.state.likes.slice();
      arr.push(postid);
      this.setState({ likes: arr });
      jsonRPCRequest = {
        jsonrpc: '2.0',
        method: 'like.set',
        params: {
          post: postid
        },
        id: Math.floor(Date.now() / 1000)
      }
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      return notify('Во время запроса к БД произошла ошибка!');
    }
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        <div className="block-content">
          <div className="text-title">Список статей</div>
          <div className="sort-items">
            <div style={{ marginTop: '10px' }}>
              <input className="sort-input" type="text" value={this.state.search} onChange={(e) => this.setState({ search: e.target.value })} placeholder="Поиск по названию" />
              {authInfo.data.uAdmin ? (
                <div key="bt" style={{ display: 'inline-block' }}>
                  <Link className="button-table" to="/post/create">Добавить статью</Link>
                  <div className="button-table" onClick={this.importData}>Импорт данных</div>
                </div>
              ) : ""}
            </div>
            <div style={{ marginTop: '10px' }}>
              <select className="sort-select" value={this.state.select} onChange={this.changeSelect}>
                <option value="-date">Дата публикации ↑</option>
                <option value="date" default>Дата публикации ↓</option>
                <option value="level">Страна ↓</option>
                <option value="-level">Страна ↑</option>
              </select>
            </div>
          </div>
          <div className="separator"></div>
          <div className="article-list">
            {this.state.data.map((elem, i) => {
              return elem.pName.toLowerCase().includes(this.state.search.toLowerCase()) ? (<div className="article" key={'article'+elem.pId}>
                <Link className="article-title" to={'/post/'+elem.pId}>{elem.pName}</Link>
                <div className="article-info">
                  <div className="article-author">Автор: {elem.pAuthor}</div>
                  <div className="article-date">{elem.pCreateDate.split('.')[0].replace('T', ' ')}</div>
                </div>
                <div className="article-image" style={{content: 'url("'+elem.pPhoto+'")'}}></div>
                <div className="article-text">{elem.pText}</div>
                <div className="article-footer">
                  {authInfo.isAuthenticated ? (<div className="article-like" onClick={(e) => this.like(elem.pId)}>
                    <div className={"like-button "+(this.state.likes.includes(elem.pId) ? "liked-button" : "")}></div>
                    <div className={"like-counter "+(this.state.likes.includes(elem.pId) ? "liked-counter" : "")}></div>
                  </div>) : ""}
                  {(authInfo.isAuthenticated && authInfo.data.uAdmin) ? (<div className="edit-button">
                    <Link className='fas fa-cog' from='/' to={"/post/"+elem.pId+"/edit"}></Link>
                  </div>) : ""}
                </div>
              </div>
            ) : ("")})}
          </div>
        </div>
        {this.state.importform ? (
          <div key="modalw">
            <div className="modal-background"></div>
            <div className="modal-window">
              <div className="modal-close" onClick={this.importData}><i className="fas fa-times"></i></div>
              <div className="modal-body">
                <div className="modal-title">Импорт данных</div>
                <div className="modal-text">Прикрепите файл с данными для помещения их в Базу Данных. Данные должны быть в формате JSON</div>
                <div className="flex-file">
                  <input type="file" name="file" id="file" onChange={this.fileUpload} className="inputfile" />
                  <label htmlFor="file"><i className="fas fa-upload"></i> Выберите файл</label>
                </div>
              </div>
            </div>
          </div>
        ) : ""}
      </div>
    );
  }
}

function UserPage(props){
  let { userid } = useParams();
  return <UserP url={userid} changePath={props.changePath} header={props.header} showHeader={props.showHeader} />
}

class UserP extends React.Component { // /user/:id
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      data: {},
      userid: this.props.url,
      show_loader: true,
      likes: [],
      redirect: ''
    }
  }

  deleteUser = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'user.delete',
      params: {
        user: this.state.userid
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse) return;
    if(jsonRPCResponse.result.message) notify(jsonRPCResponse.result.message);
    if(authInfo.data.uId == this.state.userid){
      authInfo.data = {};
      authInfo.jwt = "";
      authInfo.isAuthenticated = false;
      localStorage.removeItem('data');
      localStorage.removeItem('jwt');
    }
    this.setState({ redirect: <Redirect to={{ pathname: "/", state: { from: '/user/'+this.state.userid } }} /> });
  }

  async componentDidMount() {
    this.props.changePath('/user/'+this.state.userid);
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'user.get',
      params: {
        filter: { uId: this.state.userid },
        sort: {},
        limit: 0
      },
      id: Math.floor(Date.now() / 1000)
    }
    let jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/user/'+this.state.userid } }} /> });
      return;
    }
    if(authInfo.data.uId == this.state.userid){
      authInfo.data = jsonRPCResponse.result[0];
    }
    this.setState({ data: jsonRPCResponse.result[0] });
    jsonRPCRequest.method = "like.getUserLikes"
    jsonRPCRequest.params = { user: this.state.userid, limit: 15};
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      return;
    }
    this.setState({ show_loader: false, likes: jsonRPCResponse.result });
  }

  render() {
    return (
      <div>
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        {this.state.redirect}
        <div className="shadow-block">
          {Object.keys(this.state.data).length > 0 ? (
          <div className="block-content profile-content">
            <div className="profile-image" style={{content: 'url("'+this.state.data.uAvatar+'")'}}></div>
            <div className="profile-info">
            <div className="profile-username">{this.state.data.uName+" "+this.state.data.uSurname}</div>
              {this.state.data.uAdmin ? (
                <div className="profile-status">Администратор</div>
              ) : (
                <div className="profile-status" style={{backgroundColor: '#ccc'}}>Пользователь</div>
              )}
              <div className="profile-others">
                <div><b>Email:</b> {this.state.data.uEmail}</div>
                <div><b>Зарегистрирован:</b> {String(this.state.data.uRegDate).split('.')[0].replace('T', ' в ')}</div>
              </div>
            </div>
            {(authInfo.isAuthenticated && authInfo.data.uAdmin) ? (
              <div>
                <Link className='profile-button button-table' style={{right: '210px'}} from={'/user/'+this.state.userid} to={'/user/'+this.state.userid+'/edit'}>Изменить профиль</Link>
                <a className='profile-button button-table' style={{backgroundColor: '#DB4437'}} onClick={this.deleteUser}>Удалить профиль</a>
              </div>
            ) : ""}
          </div>
          ) : ("")}
        </div>
        <div className="block-header">
          <div className="block-title">Лайкнутые посты</div>
          <div className="block-body block-content">
            {this.state.likes.map((elem, i) => {
              return (
                <div key={i} className="block-liked"><b>{this.state.data.uName+" "+this.state.data.uSurname}</b> лайкнул пост <b><Link from={'/user/'+this.state.userid} to={'/post/'+elem.likePost}>{elem.pName}</Link></b> {String(elem.likeDate).split('.')[0].replace('T', ' в ')}</div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

function PostPage(props){
  let { postid } = useParams();
  return <PostP url={postid} changePath={props.changePath} header={props.header} showHeader={props.showHeader} />
}

class PostP extends React.Component { // /post/:id
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      show_loader: true,
      data: {},
      details: {},
      postid: this.props.url,
      redirect: '',
      likes: []
    }
  }

  async componentDidMount() {
    this.props.changePath('/post/'+this.state.postid);
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'post.get',
      params: {
        filter: { pId: this.state.postid },
        sort: {},
        limit: 0
      },
      id: Math.floor(Date.now() / 1000)
    }
    let jsonRPCResponse = await sendRequest(jsonRPCRequest);
    this.setState({ data: jsonRPCResponse.result[0] })
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/post/'+this.state.postid } }} /> });
      return;
    }

    jsonRPCRequest.method = "country.getInfo";
    jsonRPCRequest.params = { country: jsonRPCResponse.result[0].pCountry };
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      return;
    }
    this.setState({ details: jsonRPCResponse.result });
    if(authInfo.isAuthenticated){
      jsonRPCRequest.method = "like.get";
      jsonRPCRequest.params = {
        filter: { likeUser: authInfo.data.uId },
        sort: {},
        limit: 0
      };
      jsonRPCResponse = await sendRequest(jsonRPCRequest);
      if(jsonRPCResponse){
        let array = [];
        for(let i in jsonRPCResponse.result){
          array.push(jsonRPCResponse.result[i].likePost);
        }
        this.setState({ likes: array });
      }
    }
    this.setState({ show_loader: false });
  }

  like = async(postid) => {
    let jsonRPCRequest;
    if(this.state.likes.includes(postid)){
      let arr = this.state.likes.slice();
      arr.splice(this.state.likes.indexOf(postid), 1);
      this.setState({ likes: arr });
      jsonRPCRequest = {
        jsonrpc: '2.0',
        method: 'like.unset',
        params: {
          post: postid
        },
        id: Math.floor(Date.now() / 1000)
      }
    } else {
      let arr = this.state.likes.slice();
      arr.push(postid);
      this.setState({ likes: arr });
      jsonRPCRequest = {
        jsonrpc: '2.0',
        method: 'like.set',
        params: {
          post: postid
        },
        id: Math.floor(Date.now() / 1000)
      }
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      return notify('Во время запроса к БД произошла ошибка!');
    }
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        <div className="block-content">
          {Object.keys(this.state.data).length > 0 ? (
          <div className="article">
            <div className="article-title">{this.state.data.pName}</div>
            <div className="article-info">
              <div className="article-author">Автор: {this.state.data.pAuthor}</div>
              <div className="article-date">{this.state.data.pCreateDate.split('.')[0].replace('T', ' ')}</div>
            </div>
            <div className="article-image" style={{content: "url('"+this.state.data.pPhoto+"')"}}></div>
            <div className="article-text">
              {this.state.data.pText}
              {Object.keys(this.state.details).length > 0 ? (
                <div className="dynamic-info">
                  <div className="country-info">
                    <div className="country-info-title">Информация о стране: <b>{this.state.details.country.cName}</b></div>
                    <div className="cinfo-option"><b>Форма правления:</b> {this.state.details.country.cPolity}</div>
                    <div className="cinfo-option"><b>Материк:</b> {this.state.details.country.cMainland}</div>
                    <div className="cinfo-option"><b>Природный прирост:</b> {this.state.details.country.cGrowth}%</div>
                    <div className="cinfo-option"><b>Миграционное сальдо:</b> {this.state.details.country.cMigrBalance}%</div>
                    <div className="cinfo-option"><b>Состояние населения:</b> {this.state.details.country.cPopState ? "Богатое" : "Бедное"}</div>
                    <div className="cinfo-option"><b>Номинальное ВВП:</b> {this.state.details.country.cNominalGDP} $</div>
                    <div className="cinfo-option"><b>Реальное ВВП (ПКС):</b> {this.state.details.country.cRealGDP} $</div>
                    <div className="cinfo-option"><b>Развитость экономики:</b> {this.state.details.country.cDevEconomy ? "Развита" : "Не развита"}</div>
                    <div className="cinfo-option"><b>Площадь</b> {this.state.details.country.cSquare} км²</div>
                    <div className="cinfo-option"><b>Население</b> {this.state.details.country.cPopulation} чел</div>
                    <div className="cinfo-option"><b>Языки:</b></div>
                    {this.state.details.langs.map((elem, i) => {
                      return <li className='cinfo-option' key={'langs'+i}>{elem.langName} {elem.clangOfficial ? "(Официальный)" : ""} - {elem.clangProcent}%</li>;
                    })}
                    <div className="cinfo-option"><b>Нации:</b></div>
                    {this.state.details.nations.map((elem, i) => {
                      return <li className='cinfo-option' key={'nations'+i}>{elem.nName} - {elem.ncProcent}%</li>;
                     })}
                    <br />
                    <div className="cinfo-option"><b>Города страны {this.state.details.country.cName}:</b></div>
                    {Object.values(this.state.details.city).map((elem, i) => {
                      let langs = elem.langs.map((el, i) => {
                        return `${el.lang} (${el.procent}%) `;
                      });
                      return (
                        <div key={'cities'+i} style={{ marginTop: '10px' }}>
                          <b>{elem.name}:</b>
                          <li className="cinfo-option"><b>Регион:</b> {elem.region}</li>
                          <li className="cinfo-option"><b>Население:</b> {elem.population} чел</li>
                          <li className="cinfo-option"><b>Площадь:</b> {elem.square} км²</li>
                          <li className="cinfo-option"><b>Языки:</b> {langs}</li>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : ""}
            </div>
            <div className="article-footer">
              {authInfo.isAuthenticated ? (<div className="article-like" onClick={(e) => this.like(this.state.data.pId)}>
                <div className={"like-button "+(this.state.likes.includes(this.state.data.pId) ? "liked-button" : "")}></div>
                <div className={"like-counter "+(this.state.likes.includes(this.state.data.pId) ? "liked-counter" : "")}></div>
              </div>) : ""}
              {(authInfo.isAuthenticated && authInfo.data.uAdmin) ? (<div className="edit-button">
                <Link className='fas fa-cog' from='/' to={"/post/"+this.state.data.pId+"/edit"}></Link>
              </div>) : ""}
            </div>
          </div>
          ): ""}
        </div>
      </div>
    );
  }
}

function EditUser(props){
  let { userid } = useParams();
  return <EditU url={userid} changePath={props.changePath} header={props.header} showHeader={props.showHeader} />
}

class EditU extends React.Component { // /user/:id/edit
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      show_loader: true,
      show_select: false,
      data: {},
      userid: this.props.url,
      email: '',
      name: '',
      surname: '',
      avatar: '',
      newpass: '',
      admin: 0,
      redirect: ''
    }
  }

  async componentDidMount() {
    this.props.changePath('/user/'+this.state.userid+'/edit');
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'user.get',
      params: {
        filter: { uId: this.state.userid },
        sort: {},
        limit: 1
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/user/'+this.state.userid+'/edit' } }} /> });
      return;
    }
    const res = jsonRPCResponse.result[0];
    this.setState({ show_loader: false, data: res, admin: res.uAdmin, email: res.uEmail, name: res.uName, surname: res.uSurname, avatar: res.uAvatar });
  }

  saveProfile = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'user.edit',
      params: {
        user: this.state.userid,
        edit: {
          uAdmin: this.state.admin,
          uEmail: this.state.email,
          uName: this.state.name,
          uSurname: this.state.surname,
          uAvatar: this.state.avatar
        },
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(jsonRPCResponse && jsonRPCResponse.result.message) notify(jsonRPCResponse.result.message);
    this.setState({ redirect: <Redirect to={{ pathname: "/user/"+this.state.userid, state: { from: '/user/'+this.state.userid+'/edit' } }} /> });
  }

  changePassword = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'user.edit',
      params: {
        user: this.state.userid,
        edit: {
          uPass: this.state.newpass
        },
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(jsonRPCResponse && jsonRPCResponse.result.message) notify(jsonRPCResponse.result.message);
    this.setState({ redirect: <Redirect to={{ pathname: "/user/"+this.state.userid, state: { from: '/user/'+this.state.userid+'/edit' } }} /> });
  }

  toggleSelect = () => {
    this.setState({ show_select: !this.state.show_select });
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        {Object.keys(this.state.data).length > 0 ? (
          <div className="block-content">
          <div className="profile-username">Изменение профиля: <b>{this.state.data.uName+' '+this.state.data.uSurname}</b></div>
            <div className="edit-data">
              <div className="edit-profile">
                <div className="edit-profile-row">
                  <label className="edit-label" htmlFor="edit-email">Электронная почта</label>
                  <input className="sort-input edit-input" type="email" name="edit-email" onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} placeholder="Введите новый Email" />
                </div>
                <div className="edit-profile-row">
                  <label className="edit-label" htmlFor="edit-name">Имя</label>
                  <input className="sort-input edit-input" type="text" name="edit-name" onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} placeholder="Введите новое имя" />
                </div>
                <div className="edit-profile-row">
                  <label className="edit-label" htmlFor="edit-surname">Фамилия</label>
                  <input className="sort-input edit-input" type="text" name="edit-surname" onChange={(e) => this.setState({ surname: e.target.value })} value={this.state.surname} placeholder="Введите новую фамилию" />
                </div>
                <div className="edit-profile-row">
                  <label className="edit-label" htmlFor="edit-title">Ссылка на аватарку</label>
                  <input className="sort-input edit-input" type="text" name="edit-title" onChange={(e) => this.setState({ avatar: e.target.value })} value={this.state.avatar} placeholder="Введите ссылку на картинку" />
                </div>
                <div className="edit-profile-row">
                  <label className="edit-label">Роль</label>
                  <div className="login-product-select" onClick={this.toggleSelect} style={this.state.show_select ? { borderRadius: '15px 15px 0 0' }: {}}>
                    <div className="login-product-active" data-selectid="1">{roles[Number(this.state.admin)]}</div>
                    {this.state.show_select ? (
                      <div className="login-product-options">
                        {roles.map((elem, i) => {
                          if(i != this.state.admin)
                            return <div className="product-opt" key={'select'+i} data-selectid={i} onClick={(e) => this.setState({ admin: i })}>{elem}</div>;
                        })}
                      </div>
                    ) : ("")}
                    <i className="fas fa-chevron-down" style={this.state.show_select ? { transform: 'rotate(180deg)' }: {}}></i>
                  </div>
                </div>
                <div className="button-table button-edit" onClick={this.saveProfile}>Сохранить профиль</div>
              </div>
              <div className="edit-password">
                <div className="edit-profile-row">
                  <label className="edit-label">Изменение пароля</label>
                  <input className="sort-input edit-input" type="password" placeholder="Введите новый пароль" onChange={(e) => this.setState({ newpass: e.target.value })} value={this.state.newpass} style={{marginTop: '10px'}} />
                </div>
                <div className="button-table button-edit" onClick={this.changePassword}>Изменить пароль</div>
              </div>
            </div>
          </div>
        ) : ("")}
      </div>
    );
  }
}

function EditPost(props){
  let { postid } = useParams();
  return <EditP url={postid} changePath={props.changePath} header={props.header} showHeader={props.showHeader} />
}

class EditP extends React.Component { // /post/:id/edit
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      postid: this.props.url,
      show_loader: true,
      data: {},
      name: '',
      text: '',
      photo: '',
      show_select: false,
      country: [],
      selcountry: 0
    }
  }

  deletePost = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'post.delete',
      params: {
        post: this.state.postid
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(jsonRPCResponse && jsonRPCResponse.result.message) notify(jsonRPCResponse.result.message);
    this.setState({ redirect: <Redirect to={{ pathname: "/", state: { from: '/post/'+this.state.postid+'/edit' } }} /> });
  }

  savePost = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'post.edit',
      params: {
        post: this.state.postid,
        edit: {
          pName: this.state.name,
          pText: this.state.text,
          pPhoto: this.state.photo,
          pCountry: this.state.selcountry
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(jsonRPCResponse && jsonRPCResponse.result.message) notify(jsonRPCResponse.result.message);
    this.setState({ redirect: <Redirect to={{ pathname: "/post/"+this.state.postid, state: { from: '/post/'+this.state.postid+'/edit' } }} /> });
  }

  toggleSelect = () => {
    this.setState({ show_select: !this.state.show_select });
  }

  getNameCountry = (arr, elem) => {
    for(let i = 0; i < arr.length; i++){
      if(elem == arr[i].cId){
        return arr[i].cName;
      }
    }
    return "";
  }

  async componentDidMount() {
    this.props.changePath('/post/'+this.state.post+'/edit');
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'post.get',
      params: {
        filter: { pId: this.state.postid },
        sort: {},
        limit: 1
      },
      id: Math.floor(Date.now() / 1000)
    }
    let jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/post/'+this.state.postid+'/edit' } }} /> });
      return;
    }
    const res = jsonRPCResponse.result[0];
    this.setState({ data: res, name: res.pName, text: res.pText, photo: res.pPhoto, selcountry: res.pCountry });

    jsonRPCRequest.method = 'country.get';
    jsonRPCRequest.params = { filter: {}, sort: {}, limit: 0 };
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/post/'+this.state.postid+'/edit' } }} /> });
      return;
    }
    this.setState({ show_loader: false, country: jsonRPCResponse.result });
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        {Object.keys(this.state.data).length > 0 ? (
        <div className="block-content">
          <div className="profile-username">Изменение поста: <b>{this.state.data.pName}</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название поста</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ name: e.target.value})} value={this.state.name} placeholder="Введите название поста" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Текст поста</label>
              <textarea className="sort-input post-textarea" name="edit-textarea" onChange={(e) => this.setState({ text: e.target.value})} value={this.state.text} rows="24"></textarea>
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Ссылка на картинку</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ photo: e.target.value})} value={this.state.photo} placeholder="Введите ссылку на картинку" />
            </div>
            {this.state.country.length > 0 ? (
            <div className="edit-profile-row">
              <label className="edit-label">Страна</label>
              <div className="buttons-merge">
                <div className="login-product-select" onClick={this.toggleSelect} style={this.state.show_select ? { borderRadius: '15px 15px 0 0' }: {}}>
                  <div className="login-product-active" data-selectid="1">{this.getNameCountry(this.state.country, this.state.selcountry)}</div>
                    {this.state.show_select ? (
                      <div className="login-product-options">
                        {this.state.country.map((elem, i) => {
                          if(elem.cId != this.state.selcountry)
                            return <div className="product-opt" key={'select'+i} onClick={(e) => this.setState({ selcountry: elem.cId })}>{elem.cName}</div>;
                        })}
                      </div>
                    ) : ("")}
                  <i className="fas fa-chevron-down" style={this.state.show_select ? { transform: 'rotate(180deg)' }: {}}></i>
                </div>
                <Link className="button-table button-editpost" to={'/country/create'} from='/post/create'>Новая страна</Link>
                {this.state.selcountry > 0 ? <Link className="button-table button-editpost" to={'/country/'+this.state.selcountry} from='/post/create'>Изменить страну</Link>: ""}
              </div>
            </div>
            ) : ("")}
            <div className="button-table button-edit" onClick={this.savePost}>Сохранить пост</div>
            <div className="button-table button-edit" style={{backgroundColor: '#DB4437'}} onClick={this.deletePost}>Удалить пост</div>
          </div>
        </div>
        ) : ("")}
      </div>
    );
  }

}

function EditCity(props){
  let { cityid } = useParams();
  return <EditCt url={cityid} changePath={props.changePath} header={props.header} showHeader={props.showHeader} />
}

class EditCt extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      city: this.props.url,
      show_loader: true,
      select_country: false,
      country: 0,
      population: 0,
      square: 0,
      name: '',
      region: '',
      countries: [],
      data: {},
      langs: [],
      langs_list: [],
      selectLang: -1
    }
  }

  deleteCity = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'city.delete',
      params: {
        city: this.state.city,
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/city/'+this.state.city } }} /> });
      return;
    }
    notify('Город успешно удалён!');
    this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/country/"+this.state.country, state: { from: '/city/'+this.state.city } }} /> });
  }

  editCity = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'city.edit',
      params: {
        city: this.state.city,
        edit: {
          ctName: this.state.name,
          ctRegion: this.state.region,
          ctCountry: this.state.country,
          ctPopulation: this.state.population,
          ctSquare: this.state.square
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    let jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/city/'+this.state.city } }} /> });
      return;
    }

    jsonRPCRequest.method = "lang.editCity";
    jsonRPCRequest.params = {
      city: this.state.city,
      edit: Object.assign({}, this.state.langs)
    };
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/city/'+this.state.city } }} /> });
      return;
    }
    notify('Город успешно изменен!');
    this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/country/"+this.state.country, state: { from: '/city/'+this.state.city } }} /> });
  }

  getCountryName = (id) => {
    for(let i in this.state.countries){
      if(this.state.countries[i].cId == id) return this.state.countries[i].cName;
    }
    return "Не выбрано";
  }

  async componentDidMount() {
    this.props.changePath('/city/'+this.state.city);
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'city.data',
      params: {
        city: this.state.city
      },
      id: Math.floor(Date.now() / 1000)
    }
    let jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/city/'+this.state.city } }} /> });
      return;
    }
    const result = jsonRPCResponse.result;
    this.setState({ data: result, name: result.ctName, country: result.ctCountry, population: result.ctPopulation, square: result.ctSquare, region: result.ctRegion });

    jsonRPCRequest.method = "country.get";
    jsonRPCRequest.params = { filter: {}, sort: {}, limit: 0 };
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/city/'+this.state.city } }} /> });
      return;
    }
    this.setState({ countries: jsonRPCResponse.result });

    jsonRPCRequest.method = "lang.city";
    jsonRPCRequest.params = {};
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/city/'+this.state.city } }} /> });
      return;
    }
    let langsArr = [];
    let langsList = {};
    for(let i in jsonRPCResponse.result){
      let res = jsonRPCResponse.result[i];
      if(res.citylangCity == this.state.city){
        langsArr.push({ id: res.langId, procent: res.citylangProcent, name: res.langName });
      }
      if(langsList[res.langId] == undefined){
        langsList[res.langId] = {
          id: res.langId,
          name: res.langName
        };
      }
    }
    this.setState({ show_loader: false, langs: langsArr, langs_list: Object.values(langsList) });
  }

  delLang = (key) => {
    let arr = this.state.langs.slice();
    arr.splice(key, 1);
    this.setState({ langs: arr });
  }
  editLang = (key, procent) => {
    let arr = this.state.langs.slice();
    arr[key].procent = procent;
    this.setState({ langs: arr });
  }
  addLang = () => {
    if(this.state.selectLang == -1) return;
    let lang = Object.assign({}, this.state.langs_list[Number(this.state.selectLang)]);
    lang.procent = 0;
    let arr = this.state.langs.slice();
    arr.push(lang);
    this.setState({ langs: arr });
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        <div className="block-content">
          <div className="profile-username"><b>Изменение города: {this.state.data.ctName}</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название города</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ name: e.target.value})} value={this.state.name} placeholder="Введите название города" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Область / район</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ region: e.target.value})} value={this.state.region} placeholder="Введите область / район города" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Население</label>
              <input className="sort-input post-input" type="number" name="edit-title" onChange={(e) => this.setState({ population: e.target.value})} value={this.state.population} placeholder="Введите население города" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Площадь</label>
              <input className="sort-input post-input" type="number" name="edit-title" onChange={(e) => this.setState({ square: e.target.value})} value={this.state.square} placeholder="Введите площадь города" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Страна</label>
              <div className="buttons-merge">
                <div className="login-product-select" onClick={(e) => this.setState({ select_country: !this.state.select_country })} style={this.state.select_popstate ? { borderRadius: '15px 15px 0 0' }: {}}>
                  <div className="login-product-active">{this.getCountryName(this.state.country)}</div>
                    {this.state.select_country ? (
                      <div className="login-product-options">
                        {this.state.countries.map((elem, i) => {
                          if(elem.cId != this.state.country)
                            return <div className="product-opt" key={'selectpop'+i} onClick={(e) => this.setState({ country: elem.cId })}>{elem.cName}</div>;
                        })}
                      </div>
                    ) : ("")}
                  <i className="fas fa-chevron-down" style={this.state.select_country ? { transform: 'rotate(180deg)' }: {}}></i>
                </div>
              </div>
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Языки</label>
              {this.state.langs.map((elem, i) => {
                return (
                  <div key={'divlang'+i} style={{ display: 'flex', margin: '5px 0' }}>
                    <div className="city-button" key={'lang-'+i} onClick={(e) => this.setState({ redirect: <Redirect to={{ pathname: "/lang/"+elem.id, state: { from: '/city/'+this.state.city } }} /> })}>{elem.name}</div>
                    <input className="sort-input post-input" type="number" style={{ width: '50px', padding: '6px 14px', margin: '0 5px' }} onChange={(e) => this.editLang(i, e.target.value)} value={elem.procent} placeholder="Введите процент" />
                    <div className="span-delete" onClick={(e) => this.delLang(i)}>Удалить</div>
                  </div>
                )
              })}
              <select className="city-button" value={this.state.selectLang} onChange={(e) => this.setState({ selectLang: e.target.value })}>
                <option value="-1">Не выбрано</option>
                {this.state.langs_list.map((elem, i) => {
                  let found = false;
                  for(let i in this.state.langs){
                    if(this.state.langs[i].id == elem.id) found = true;
                  }
                  if(!found){
                    return <option key={'selectlang'+i} value={i}>{elem.name}</option>;
                  }
                })}
              </select>
              <div className="button-table button-edit" style={{ padding: '6px 14px', margin: '0 5px' }} onClick={this.addLang}>Добавить</div>
              <div className="button-table button-edit" style={{ padding: '6px 14px', margin: '0 5px' }} onClick={(e) => this.setState({ redirect: <Redirect to={{ pathname: "/lang/create", state: { from: '/city/'+this.state.city } }} /> })}>Новый язык</div>
            </div>
            <div className="button-table button-edit" onClick={this.editCity}>Изменить город</div>
            <div className="button-table button-edit" style={{backgroundColor: '#DB4437'}} onClick={this.deleteCity}>Удалить город</div>
          </div>
        </div>
      </div>
    );
  }
}

function EditNation(props){
  let { nationid } = useParams();
  return <EditN url={nationid} changePath={props.changePath} header={props.header} showHeader={props.showHeader} />
}

class EditN extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      show_loader: true,
      nation: this.props.url,
      religion: '',
      race: '',
      name: '',
      ukr_name: '',
      data: {}
    }
  }

  deleteNation = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'nation.delete',
      params: {
        nation: this.state.nation,
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/nation/'+this.state.nation } }} /> });
      return;
    }
    notify('Нация успешно удалена!');
    this.setState({ redirect: <Redirect to={{ pathname: "/", state: { from: '/nation/'+this.state.nation } }} /> });
  }

  editNation = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'nation.edit',
      params: {
        nation: this.state.nation,
        edit: {
          nName: this.state.name,
          nUkrName: this.state.ukr_name,
          nRace: this.state.race,
          nReligion: this.state.religion
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/nation/'+this.state.nation } }} /> });
      return;
    }
    this.setState({ redirect: <Redirect to={{ pathname: '/', state: { from: '/nation/'+this.state.nation } }} /> });
    notify('Нация успешно изменена!');
  }

  async componentDidMount() {
    this.props.changePath('/nation/'+this.state.nation);
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'nation.get',
      params: {
        nation: this.state.nation
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/nation/'+this.state.nation } }} /> });
      return;
    }
    const response = jsonRPCResponse.result;
    this.setState({ show_loader: false, data: response, religion: response.nReligion, race: response.nRace, name: response.nName, ukr_name: response.nUkrName });  
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        <div className="block-content">
          <div className="profile-username"><b>Изменение нации: {this.state.data.nName}</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название нации</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ name: e.target.value})} value={this.state.name} placeholder="Введите название нации" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Русское название</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ ukr_name: e.target.value})} value={this.state.ukr_name} placeholder="Введите русское название" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Раса</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ race: e.target.value})} value={this.state.race} placeholder="Введите расу" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Религия</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ religion: e.target.value})} value={this.state.religion} placeholder="Введите религию" />
            </div>
            <div className="button-table button-edit" onClick={this.editNation}>Изменить нацию</div>
            <div className="button-table button-edit" style={{backgroundColor: '#DB4437'}} onClick={this.deleteNation}>Удалить нацию</div>
          </div>
        </div>
      </div>
    );
  } 
}

function EditLang(props){
  let { langid } = useParams();
  return <EditL url={langid} changePath={props.changePath} header={props.header} showHeader={props.showHeader} />
}

class EditL extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      show_loader: true,
      lang: this.props.url,
      langname: "",
      langukrname: "",
      data: {}
    }
  }

  deleteLang = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'lang.delete',
      params: {
        lang: this.state.lang
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/lang/'+this.state.lang } }} /> });
      return;
    }
    notify('Язык успешно удален!');
    this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/", state: { from: '/lang/'+this.state.lang } }} /> });
  }

  editLang = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'lang.edit',
      params: {
        lang: this.state.lang,
        edit: {
          langName: this.state.langname,
          langUkrName: this.state.langukrname
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/lang/'+this.state.lang } }} /> });
      return;
    }
    notify('Язык успешно изменен!');
    this.setState({ redirect: <Redirect to={{ pathname: '/', state: { from: '/lang/'+this.state.lang } }} /> });
  }

  async componentDidMount() {
    this.props.changePath('/lang/'+this.state.lang);
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'lang.get',
      params: {
        lang: this.state.lang
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/lang/'+this.state.lang } }} /> });
      return;
    }
    const response = jsonRPCResponse.result;
    this.setState({ show_loader: false, data: response, langname: response.langName, langukrname: response.langUkrName });  
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        <div className="block-content">
          <div className="profile-username"><b>Изменение языка: {this.state.data.langName}</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название языка</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ langname: e.target.value})} value={this.state.langname} placeholder="Введите название языка" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Русское название</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ langukrname: e.target.value})} value={this.state.langukrname} placeholder="Введите русское название" />
            </div>
            <div className="button-table button-edit" onClick={this.editLang}>Изменить язык</div>
            <div className="button-table button-edit" style={{backgroundColor: '#DB4437'}} onClick={this.deleteLang}>Удалить язык</div>
          </div>
        </div>
      </div>
    );
  }    
}

function EditCountry(props){
  let { countryid } = useParams();
  return <EditC url={countryid} changePath={props.changePath} header={props.header} showHeader={props.showHeader} />
}

class EditC extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      countryid: this.props.url,
      show_loader: true,
      data: {},
      select_devstate: false,
      devstate: 0,
      select_popstate: false,
      popstate: 0,
      population: 0,
      square: 0,
      realgdp: 0,
      nominalgdp: 0,
      migrbalance: 0,
      growth: 0,
      mainland: '',
      polity: '',
      name: '',
      capital: '',
      city_list: [],
      nations_list: [],
      langs_list: [],
      langs: [],
      nations: [],
      selectLang: -1,
      selectNation: -1
    }
  }

  editCountry = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'country.edit',
      params: {
        country: this.state.countryid,
        edit: {
          cName: this.state.name,
          cCapital: this.state.capital,
          cPolity: this.state.polity,
          cMainland: this.state.mainland,
          cGrowth: this.state.growth,
          cMigrBalance: this.state.migrbalance,
          cPopState: this.state.popstate,
          cNominalGDP: this.state.nominalgdp,
          cRealGDP: this.state.realgdp,
          cDevEconomy: this.state.devstate,
          cSquare: this.state.square,
          cPopulation: this.state.population
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    let jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/country/'+this.state.countryid } }} /> });
      return;
    }
    //////
    jsonRPCRequest.method = "lang.editCountry";
    jsonRPCRequest.params = {
      country: this.state.countryid,
      edit: Object.assign({}, this.state.langs)
    };
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/country/'+this.state.countryid } }} /> });
      return;
    }
    //////
    jsonRPCRequest.method = "nation.editCountry";
    jsonRPCRequest.params = {
      country: this.state.countryid,
      edit: Object.assign({}, this.state.nations)
    };
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/country/'+this.state.countryid } }} /> });
      return;
    }
    notify('Страна успешно изменена!');
  }

  deleteCountry = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'country.delete',
      params: {
        country: this.state.countryid
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/country/'+this.state.countryid } }} /> });
      return;
    }
    notify('Страна успешно удалена!');
    this.setState({ redirect: <Redirect to={{ pathname: "/", state: { from: '/country/'+this.state.countryid } }} /> });
  }

  async componentDidMount() {
    this.props.changePath('/country/'+this.state.countryid);
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'country.getInfo',
      params: {
        country: this.state.countryid
      },
      id: Math.floor(Date.now() / 1000)
    }
    let jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/country/'+this.state.countryid } }} /> });
      return;
    }
    let response = jsonRPCResponse.result;
    this.setState({
      data: response,
      devstate: response.country.cDevEconomy, popstate: response.country.cPopState, population: response.country.cPopulation,
      square: response.country.cSquare, realgdp: response.country.cRealGDP, nominalgdp: response.country.cNominalGDP,
      migrbalance: response.country.cMigrBalance, growth: response.country.cGrowth, mainland: response.country.cMainland, 
      polity: response.country.cPolity, name: response.country.cName, capital: response.country.cCapital,
      city_list: response.city
    });
    /////
    jsonRPCRequest.method = "nation.data";
    jsonRPCRequest.params = {};
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/country/'+this.state.countryid } }} /> });
      return;
    }
    let nationsArr = [];
    let nationsList = {};
    for(let i in jsonRPCResponse.result){
      let res = jsonRPCResponse.result[i];
      if(res.ncCountry == this.state.countryid){
        nationsArr.push({ id: res.nId, procent: res.ncProcent, name: res.nName });
      }
      if(nationsList[res.ncNation] == undefined){
        nationsList[res.ncNation] = {
          id: res.nId,
          name: res.nName
        };
      }
    }
    this.setState({ nations: nationsArr, nations_list: Object.values(nationsList) });
    /////
    jsonRPCRequest.method = "lang.country";
    jsonRPCRequest.params = {};
    jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/country/'+this.state.countryid } }} /> });
      return;
    }
    let langsArr = [];
    let langsList = {};
    for(let i in jsonRPCResponse.result){
      let res = jsonRPCResponse.result[i];
      if(res.clangCountry == this.state.countryid){
        langsArr.push({ id: res.langId, procent: res.clangProcent, name: res.langName });
      }
      if(langsList[res.clangLang] == undefined){
        langsList[res.clangLang] = {
          id: res.langId,
          name: res.langName
        };
      }
    }
    this.setState({ show_loader: false, langs: langsArr, langs_list: Object.values(langsList) });
  }
  delLang = (key) => {
    let arr = this.state.langs.slice();
    arr.splice(key, 1);
    this.setState({ langs: arr });
  }
  editLang = (key, procent) => {
    let arr = this.state.langs.slice();
    arr[key].procent = procent;
    this.setState({ langs: arr });
  }
  addLang = () => {
    if(this.state.selectLang == -1) return;
    let lang = Object.assign({}, this.state.langs_list[Number(this.state.selectLang)]);
    lang.procent = 0;
    let arr = this.state.langs.slice();
    arr.push(lang);
    this.setState({ langs: arr });
  }
  delNation = (key) => {
    let arr = this.state.nations.slice();
    arr.splice(key, 1);
    this.setState({ nations: arr });
  }
  editNation = (key, procent) => {
    let arr = this.state.nations.slice();
    arr[key].procent = procent;
    this.setState({ nations: arr });
  }
  addNation = () => {
    if(this.state.selectNation == -1) return;
    let nation = Object.assign({}, this.state.nations_list[Number(this.state.selectNation)]);
    nation.procent = 0;
    let arr = this.state.nations.slice();
    arr.push(nation);
    this.setState({ nations: arr });
  }
  render() {
    let cities = Object.entries(this.state.city_list);
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        <div className="block-content">
          <div className="profile-username"><b>Изменение страны {this.state.data.cName}</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название страны</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ name: e.target.value})} value={this.state.name} placeholder="Введите название страны" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Столица</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ capital: e.target.value})} value={this.state.capital} placeholder="Введите название столицы" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Форма правления</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ polity: e.target.value})} value={this.state.polity} placeholder="Введите форму правления" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Материк</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ mainland: e.target.value})} value={this.state.mainland} placeholder="Введите название материка" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Природный прирост (в процентах)</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ growth: e.target.value}) : false} value={this.state.growth} placeholder="Введите процент природного прироста" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Миграционное сальдо (в процентах)</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ migrbalance: e.target.value}) : false} value={this.state.migrbalance} placeholder="Введите процент миграционного сальдо" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Номинальный ВВП, $</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ nominalgdp: e.target.value}) : false} value={this.state.nominalgdp} placeholder="Введите номинальный ВВП" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">ВВП за ПКС, $</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ realgdp: e.target.value}) : false} value={this.state.realgdp} placeholder="Введите ВВП за ПКС" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Площадь страны, м2</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ square: e.target.value}) : false} value={this.state.square} placeholder="Введите площадь страны" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Население страны, чел</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ population: e.target.value}) : false} value={this.state.population} placeholder="Введите население страны" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Состояние населения</label>
              <div className="buttons-merge">
                <div className="login-product-select" onClick={(e) => this.setState({ select_popstate: !this.state.select_popstate })} style={this.state.select_popstate ? { borderRadius: '15px 15px 0 0' }: {}}>
                  <div className="login-product-active">{['Бедное', 'Богатое'][this.state.popstate]}</div>
                    {this.state.select_popstate ? (
                      <div className="login-product-options">
                        {['Бедное', 'Богатое'].map((elem, i) => {
                          if(i != this.state.popstate)
                            return <div className="product-opt" key={'selectpop'+i} onClick={(e) => this.setState({ popstate: i })}>{elem}</div>;
                        })}
                      </div>
                    ) : ("")}
                  <i className="fas fa-chevron-down" style={this.state.select_popstate ? { transform: 'rotate(180deg)' }: {}}></i>
                </div>
              </div>
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Развитость экономики</label>
              <div className="buttons-merge">
                <div className="login-product-select" onClick={(e) => this.setState({ select_devstate: !this.state.select_devstate })} style={this.state.select_devstate ? { borderRadius: '15px 15px 0 0' }: {}}>
                  <div className="login-product-active">{['Не развита', 'Развита'][this.state.devstate]}</div>
                    {this.state.select_devstate ? (
                     <div className="login-product-options">
                      {['Не развита', 'Развита'].map((elem, i) => {
                       if(i != this.state.devstate)
                         return <div className="product-opt" key={'selectdev'+i} onClick={(e) => this.setState({ devstate: i })}>{elem}</div>;
                      })}
                      </div>
                    ) : ("")}
                  <i className="fas fa-chevron-down" style={this.state.select_devstate ? { transform: 'rotate(180deg)' }: {}}></i>
                </div>
              </div>
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Города</label>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {cities.map((elem, i) => {
                  return <div className="city-button" key={'city-'+i} onClick={(e) => this.setState({ redirect: <Redirect to={{ pathname: "/city/"+elem[0], state: { from: '/country/'+this.state.countryid } }} /> })}>{elem[1].name}</div>;
                })}
                <div className="button-table city-button-add" onClick={(e) => this.setState({ redirect: <Redirect to={{ pathname: "/city/create", state: { from: '/country/'+this.state.countryid } }} /> })}>Добавить город</div>
              </div>
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Нации</label>
              {this.state.nations.map((elem, i) => {
                return (
                  <div key={'divnation'+i} style={{ display: 'flex', margin: '5px 0' }}>
                    <div className="city-button" key={'nation-'+i} onClick={(e) => this.setState({ redirect: <Redirect to={{ pathname: "/nation/"+elem.id, state: { from: '/country/'+this.state.countryid } }} /> })}>{elem.name}</div>
                    <input className="sort-input post-input" type="number" style={{ width: '50px', padding: '6px 14px', margin: '0 5px' }} onChange={(e) => this.editNation(i, e.target.value)} value={elem.procent} placeholder="Введите процент" />
                    <div className="span-delete" onClick={(e) => this.delNation(i)}>Удалить</div>
                  </div>
                )
              })}
              <select className="city-button" value={this.state.selectNation} onChange={(e) => this.setState({ selectNation: e.target.value })}>
                <option value="-1">Не выбрано</option>
                {this.state.nations_list.map((elem, i) => {
                  let found = false;
                  for(let i in this.state.nations){
                    if(this.state.nations[i].id == elem.id) found = true;
                  }
                  if(!found){
                    return <option key={'selectnation'+i} value={i}>{elem.name}</option>;
                  }
                })}
              </select>
              <div className="button-table button-edit" style={{ padding: '6px 14px', margin: '0 5px' }} onClick={this.addNation}>Добавить</div>
              <div className="button-table button-edit" style={{ padding: '6px 14px', margin: '0 5px' }} onClick={(e) => this.setState({ redirect: <Redirect to={{ pathname: "/nation/create", state: { from: '/country/'+this.state.countryid } }} /> })}>Новая нация</div>
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Языки</label>
              {this.state.langs.map((elem, i) => {
                return (
                  <div key={'divlang'+i} style={{ display: 'flex', margin: '5px 0' }}>
                    <div className="city-button" key={'lang-'+i} onClick={(e) => this.setState({ redirect: <Redirect to={{ pathname: "/lang/"+elem.id, state: { from: '/country/'+this.state.countryid } }} /> })}>{elem.name}</div>
                    <input className="sort-input post-input" type="number" style={{ width: '50px', padding: '6px 14px', margin: '0 5px' }} onChange={(e) => this.editLang(i, e.target.value)} value={elem.procent} placeholder="Введите процент" />
                    <div className="span-delete" onClick={(e) => this.delLang(i)}>Удалить</div>
                  </div>
                )
              })}
              <select className="city-button" value={this.state.selectLang} onChange={(e) => this.setState({ selectLang: e.target.value })}>
                <option value="-1">Не выбрано</option>
                {this.state.langs_list.map((elem, i) => {
                  let found = false;
                  for(let i in this.state.langs){
                    if(this.state.langs[i].id == elem.id) found = true;
                  }
                  if(!found){
                    return <option key={'selectlang'+i} value={i}>{elem.name}</option>;
                  }
                })}
              </select>
              <div className="button-table button-edit" style={{ padding: '6px 14px', margin: '0 5px' }} onClick={this.addLang}>Добавить</div>
              <div className="button-table button-edit" style={{ padding: '6px 14px', margin: '0 5px' }} onClick={(e) => this.setState({ redirect: <Redirect to={{ pathname: "/lang/create", state: { from: '/country/'+this.state.countryid } }} /> })}>Новый язык</div>
            </div> 
            <div className="button-table button-edit" onClick={this.editCountry}>Изменить страну</div>
            <div className="button-table button-edit" style={{backgroundColor: '#DB4437'}} onClick={this.deleteCountry}>Удалить страну</div>
          </div>
        </div>
      </div>
    );
  }
}

class CreateCountry extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      select_devstate: false,
      devstate: 0,
      select_popstate: false,
      popstate: 0,
      population: 0,
      square: 0,
      realgdp: 0,
      nominalgdp: 0,
      migrbalance: 0,
      growth: 0,
      mainland: '',
      polity: '',
      name: '',
      capital: ''
    }
  }

  createCountry = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'country.create',
      params: {
        create: {
          name: this.state.name,
          capital: this.state.capital,
          polity: this.state.polity,
          mainland: this.state.mainland,
          growth: this.state.growth,
          migrbalance: this.state.migrbalance,
          popstate: this.state.popstate,
          nominalgdp: this.state.nominalgdp,
          realgdp: this.state.realgdp,
          deveconomy: this.state.devstate,
          square: this.state.square,
          population: this.state.population
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/country/create' } }} /> });
      return;
    }
    notify('Страна успешно создана!');
    this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/country/"+jsonRPCResponse.result.country, state: { from: '/country/create' } }} /> });
  }

  componentDidMount() {
    this.props.changePath('/country/create');
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        <div className="block-content">
          <div className="profile-username"><b>Создание новой страны</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название страны</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ name: e.target.value})} value={this.state.name} placeholder="Введите название страны" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Столица</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ capital: e.target.value})} value={this.state.capital} placeholder="Введите название столицы" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Форма правления</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ polity: e.target.value})} value={this.state.polity} placeholder="Введите форму правления" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Материк</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ mainland: e.target.value})} value={this.state.mainland} placeholder="Введите название материка" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Природный прирост (в процентах)</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ growth: e.target.value}) : false} value={this.state.growth} placeholder="Введите процент природного прироста" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Миграционное сальдо (в процентах)</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ migrbalance: e.target.value}) : false} value={this.state.migrbalance} placeholder="Введите процент миграционного сальдо" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Номинальный ВВП, $</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ nominalgdp: e.target.value}) : false} value={this.state.nominalgdp} placeholder="Введите номинальный ВВП" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">ВВП за ПКС, $</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ realgdp: e.target.value}) : false} value={this.state.realgdp} placeholder="Введите ВВП за ПКС" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Площадь страны, м2</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ square: e.target.value}) : false} value={this.state.square} placeholder="Введите площадь страны" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Население страны, чел</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => !isNaN(Number(e.target.value)) ? this.setState({ population: e.target.value}) : false} value={this.state.population} placeholder="Введите население страны" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Состояние населения</label>
              <div className="buttons-merge">
                <div className="login-product-select" onClick={(e) => this.setState({ select_popstate: !this.state.select_popstate })} style={this.state.select_popstate ? { borderRadius: '15px 15px 0 0' }: {}}>
                  <div className="login-product-active">{['Бедное', 'Богатое'][this.state.popstate]}</div>
                    {this.state.select_popstate ? (
                      <div className="login-product-options">
                        {['Бедное', 'Богатое'].map((elem, i) => {
                          if(i != this.state.popstate)
                            return <div className="product-opt" key={'selectpop'+i} onClick={(e) => this.setState({ popstate: i })}>{elem}</div>;
                        })}
                      </div>
                    ) : ("")}
                  <i className="fas fa-chevron-down" style={this.state.select_popstate ? { transform: 'rotate(180deg)' }: {}}></i>
                </div>
              </div>
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Развитость экономики</label>
              <div className="buttons-merge">
                <div className="login-product-select" onClick={(e) => this.setState({ select_devstate: !this.state.select_devstate })} style={this.state.select_devstate ? { borderRadius: '15px 15px 0 0' }: {}}>
                  <div className="login-product-active">{['Не развита', 'Развита'][this.state.devstate]}</div>
                    {this.state.select_devstate ? (
                     <div className="login-product-options">
                      {['Не развита', 'Развита'].map((elem, i) => {
                       if(i != this.state.devstate)
                         return <div className="product-opt" key={'selectdev'+i} onClick={(e) => this.setState({ devstate: i })}>{elem}</div>;
                      })}
                      </div>
                    ) : ("")}
                  <i className="fas fa-chevron-down" style={this.state.select_devstate ? { transform: 'rotate(180deg)' }: {}}></i>
                </div>
              </div>
            </div>
            <div className="button-table button-edit" onClick={this.createCountry}>Создать страну</div>
          </div>
        </div>
      </div>
    );
  }  
}

class CreateCity extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      show_loader: true,
      select_country: false,
      country: 0,
      population: 0,
      square: 0,
      name: '',
      region: '',
      countries: []
    }
  }

  createCity = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'city.create',
      params: {
        create: {
          name: this.state.name,
          region: this.state.region,
          country: this.state.country,
          population: this.state.population,
          square: this.state.square
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/city/create' } }} /> });
      return;
    }
    notify('Город успешно создан!');
    this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/city/"+jsonRPCResponse.result.city, state: { from: '/city/create' } }} /> });
  }

  getCountryName = (id) => {
    for(let i in this.state.countries){
      if(this.state.countries[i].cId == id) return this.state.countries[i].cName;
    }
    return "Не выбрано";
  }

  async componentDidMount() {
    this.props.changePath('/city/create');
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'country.get',
      params: {
        filter: {},
        sort: {},
        limit: 0
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/city/create' } }} /> });
      return;
    }
    const response = jsonRPCResponse.result;
    this.setState({ show_loader: false, countries: response });
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        {this.state.show_loader ? <div className="hoja"></div> : ""}
        <div className="block-content">
          <div className="profile-username"><b>Создание нового города</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название города</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ name: e.target.value})} value={this.state.name} placeholder="Введите название города" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Область / район</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ region: e.target.value})} value={this.state.region} placeholder="Введите область / район города" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Население</label>
              <input className="sort-input post-input" type="number" name="edit-title" onChange={(e) => this.setState({ population: e.target.value})} value={this.state.population} placeholder="Введите население города" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Площадь</label>
              <input className="sort-input post-input" type="number" name="edit-title" onChange={(e) => this.setState({ square: e.target.value})} value={this.state.square} placeholder="Введите площадь города" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label">Страна</label>
              <div className="buttons-merge">
                <div className="login-product-select" onClick={(e) => this.setState({ select_country: !this.state.select_country })} style={this.state.select_popstate ? { borderRadius: '15px 15px 0 0' }: {}}>
                  <div className="login-product-active">{this.getCountryName(this.state.country)}</div>
                    {this.state.select_country ? (
                      <div className="login-product-options">
                        {this.state.countries.map((elem, i) => {
                          if(elem.cId != this.state.country)
                            return <div className="product-opt" key={'selectpop'+i} onClick={(e) => this.setState({ country: elem.cId })}>{elem.cName}</div>;
                        })}
                      </div>
                    ) : ("")}
                  <i className="fas fa-chevron-down" style={this.state.select_country ? { transform: 'rotate(180deg)' }: {}}></i>
                </div>
              </div>
            </div>
            <div className="button-table button-edit" onClick={this.createCity}>Создать город</div>
          </div>
        </div>
      </div>
    );
  }
}

class CreateNation extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      religion: '',
      race: '',
      name: '',
      ukr_name: ''
    }
  }

  createNation = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'nation.create',
      params: {
        create: {
          name: this.state.name,
          ukrname: this.state.ukr_name,
          race: this.state.race,
          religion: this.state.religion
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/nation/create' } }} /> });
      return;
    }
    notify('Нация успешно создана!');
    this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/nation/"+jsonRPCResponse.result.nation, state: { from: '/nation/create' } }} /> });
  }

  componentDidMount() {
    this.props.changePath('/nation/create');
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        <div className="block-content">
          <div className="profile-username"><b>Создание новой нации</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название нации</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ name: e.target.value})} value={this.state.name} placeholder="Введите название нации" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Русское название</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ ukr_name: e.target.value})} value={this.state.ukr_name} placeholder="Введите русское название" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Раса</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ race: e.target.value})} value={this.state.race} placeholder="Введите расу" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Религия</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ religion: e.target.value})} value={this.state.religion} placeholder="Введите религию" />
            </div>
            <div className="button-table button-edit" onClick={this.createNation}>Создать нацию</div>
          </div>
        </div>
      </div>
    );
  }  
}

class CreateLang extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      langname: "",
      langukrname: ""
    }
  }

  createLang = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'lang.create',
      params: {
        create: {
          name: this.state.langname,
          ukrname: this.state.langukrname
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/lang/create' } }} /> });
      return;
    }
    notify('Язык успешно создан!');
    this.setState({ show_loader: false, redirect: <Redirect to={{ pathname: "/lang/"+jsonRPCResponse.result.lang, state: { from: '/lang/create' } }} /> });
  }

  componentDidMount() {
    this.props.changePath('/lang/create');
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        <div className="block-content">
          <div className="profile-username"><b>Создание нового языка</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название языка</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ langname: e.target.value})} value={this.state.langname} placeholder="Введите название языка" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Русское название</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ langukrname: e.target.value})} value={this.state.langukrname} placeholder="Введите русское название" />
            </div>
            <div className="button-table button-edit" onClick={this.createLang}>Создать язык</div>
          </div>
        </div>
      </div>
    );
  }  
}

class CreatePost extends React.Component { // /post/create
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.state = {
      redirect: '',
      show_loader: true,
      name: '',
      text: '',
      photo: '',
      selcountry: 0,
      show_select: false,
      country: []
    }
  }

  toggleSelect = () => {
    this.setState({ show_select: !this.state.show_select });
  }

  getNameCountry = (arr, elem) => {
    for(let i = 0; i < arr.length; i++){
      if(elem == arr[i].cId){
        return arr[i].cName;
      }
    }
    return "";
  }

  createPost = async() => {
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'post.create',
      params: {
        create: {
          title: this.state.name,
          text: this.state.text,
          photo: this.state.photo,
          country: this.state.selcountry,
          author: authInfo.data.uName+" "+authInfo.data.uSurname
        }
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(jsonRPCResponse && jsonRPCResponse.result.message){
      notify(jsonRPCResponse.result.message);
      this.setState({ redirect: <Redirect to={{ pathname: "/post/"+jsonRPCResponse.result.post, state: { from: '/post/create' } }} /> });
    }
    else {
      this.setState({ redirect: <Redirect to={{ pathname: "/", state: { from: '/post/create' } }} /> });
    }
  }

  async componentDidMount() {
    this.props.changePath('/post/create');
    const jsonRPCRequest = {
      jsonrpc: '2.0',
      method: 'country.get',
      params: {
        filter: {},
        sort: {},
        limit: 0
      },
      id: Math.floor(Date.now() / 1000)
    }
    const jsonRPCResponse = await sendRequest(jsonRPCRequest);
    if(!jsonRPCResponse){
      this.setState({ show_loader: false });
      this.setState({ redirect: <Redirect to={{ pathname: "/not-found", state: { from: '/post/create' } }} /> });
      return;
    }
    this.setState({ show_loader: false, country: jsonRPCResponse.result });
  }

  render() {
    return (
      <div className="shadow-block">
        {this.state.redirect}
        <div className="block-content">
          <div className="profile-username"><b>Создание нового поста</b></div>
          <div className="edit-profile">
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Название поста</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ name: e.target.value})} value={this.state.name} placeholder="Введите название поста" />
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-textarea">Текст поста</label>
              <textarea className="sort-input post-textarea" name="edit-textarea" onChange={(e) => this.setState({ text: e.target.value})} value={this.state.text} rows="24"></textarea>
            </div>
            <div className="edit-profile-row">
              <label className="edit-label" htmlFor="edit-title">Ссылка на картинку</label>
              <input className="sort-input post-input" type="text" name="edit-title" onChange={(e) => this.setState({ photo: e.target.value})} value={this.state.photo} placeholder="Введите ссылку на картинку" />
            </div>
            {this.state.country.length > 0 ? (
            <div className="edit-profile-row">
              <label className="edit-label">Страна</label>
              <div className="buttons-merge">
                <div className="login-product-select" onClick={this.toggleSelect} style={this.state.show_select ? { borderRadius: '15px 15px 0 0' }: {}}>
                  <div className="login-product-active" data-selectid="1">{this.getNameCountry(this.state.country, this.state.selcountry)}</div>
                    {this.state.show_select ? (
                      <div className="login-product-options">
                        {this.state.country.map((elem, i) => {
                          if(elem.cId != this.state.selcountry)
                            return <div className="product-opt" key={'select'+i} onClick={(e) => this.setState({ selcountry: elem.cId })}>{elem.cName}</div>;
                        })}
                      </div>
                    ) : ("")}
                  <i className="fas fa-chevron-down" style={this.state.show_select ? { transform: 'rotate(180deg)' }: {}}></i>
                </div>
                <Link className="button-table button-editpost" to={'/country/create'} from='/post/create'>Новая страна</Link>
                {this.state.selcountry > 0 ? <Link className="button-table button-editpost" to={'/country/'+this.state.selcountry} from='/post/create'>Изменить страну</Link>: ""}
              </div>
            </div>
            ) : ("")}
            <div className="button-table button-edit" onClick={this.createPost}>Создать пост</div>
          </div>
        </div>
      </div>
    );
  }
}

class NotFound extends React.Component {
  constructor(props){
    super(props);
    if(this.props.header === false) this.props.showHeader(true);
    this.props.changePath('/not-found');
  }

  render(){
    return (
      <div className="page-notfound"><img src="https://i.gifer.com/G2TW.gif" alt='GIF not found' /></div>
    );
  }
}

class Header extends React.Component {
  constructor(props){
    super(props);
    console.log('Path', window.location.pathname);
    this.state = {
      redirect: ''
    }
  }
  componentDidUpdate(){
    console.log(window.location.pathname);
  }
  logOut = () => {
    authInfo.isAuthenticated = false;
    authInfo.data = {};
    authInfo.jwt = "";
    localStorage.removeItem('data');
    localStorage.removeItem('jwt');
    this.setState({ redirect: <Redirect to={{ pathname: "/login"}} /> });
  }

  render() {
    return (
      <div className="navbar">
        <div className="nav-leftbar">
          <Link className="navlink-static" to='/' style={{ fontWeight: 'bold' }}>Курсовой проект</Link>
        </div>
        <div className="nav-center">
          <Link className={'navlink '+(this.props.path === "/" ? "navlink-active" : "")} to="/">Главная</Link>
          {authInfo.isAuthenticated ? <Link className={'navlink '+(this.props.path.includes("/user/"+authInfo.data.uId) ? "navlink-active" : "")}  to={'/user/'+authInfo.data.uId} from='/'>Мой профиль</Link> : ""}
          {(this.props.path.includes('/user/') && !this.props.path.includes(authInfo.data.uId)) ? <a className="navlink navlink-active">Пользователи</a> : ""}
          {this.props.path.includes('/post/') ? <a className="navlink navlink-active">Посты</a> : ""}
          {this.props.path.includes('/country/') ? <a className="navlink navlink-active">Страны</a> : ""}
          {this.props.path.includes('/city/') ? <a className="navlink navlink-active">Города</a> : ""}
          {this.props.path.includes('/nation/') ? <a className="navlink navlink-active">Нации</a> : ""}
          {this.props.path.includes('/lang/') ? <a className="navlink navlink-active">Языки</a> : ""}
        </div>
        <div className="nav-rightbar">
          {authInfo.isAuthenticated ? <a className="navlink-static" onClick={this.logOut}>Выйти</a> : <Link className="navlink-static" to='/login' from='/'>Войти</Link>}
        </div>
        {this.state.redirect}
      </div>
    );
  }
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authInfo.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

async function sendRequest(jsonRPCRequest){
  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'    
    }
    if(authInfo.isAuthenticated && authInfo.jwt) headers['Authorization'] = 'Bearer '+authInfo.jwt;
    const response = await fetch("http://"+window.location.hostname+":3001/api", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(jsonRPCRequest)
    });
    const json = await response.json();
    if(!json){
      notify('Ошибка подключения к серверу');
      return false;
    }
    if(json.error || !json.result){
      if(json.error.message && Number(json.error.code) > 0) {
        notify(json.error.message);
      }
      return false;
    }
    return json;
  } catch(e) {
    console.error('Ошибка:', e);
    return false;
  }
}

function notify(message){
  document.querySelector('#showError').innerHTML = message;
  document.querySelector('#showError').style.top = '0px';
}
const roles = ['Пользователь', 'Администратор'];

export default App;
