import { React, Component } from "react";

class KommunicateChat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.createKommunicateIfNotExists();
    this.updateKommunicate();
  }

  componentDidUpdate() {
    this.createKommunicateIfNotExists();
    this.updateKommunicate();
  }

  createKommunicate(d, m) {
    let userId = this.props.user.id;

    var kommunicateSettings = {
      "appId": "396c1757e3330d8b71c5ada4fd062dee7",
      onInit: () => {
        window.Kommunicate?.updateChatContext({user_id: userId?.toString()});
        window.Kommunicate?.displayKommunicateWidget(userId !== undefined);

        // Update card css to show the qr code
        var css = ".km-carousel-card-header { height: 220px !important; } .km-carousel-card-img { height: 110% !important; }"
        window.Kommunicate?.customizeWidgetCss(css);
      },
      "popupWidget": false,
      "automaticChatOpenOnNavigation": true
    };

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://widget.kommunicate.io/v2/kommunicate.app";

    var h = document.getElementsByTagName("head")[0];
    h.appendChild(s);
    
    window.kommunicate = m;
    m._globals = kommunicateSettings;
  }

  createKommunicateIfNotExists() {
    // Should use this.state.isCreated
    if (window.Kommunicate === null || window.Kommunicate === undefined) {
      this.createKommunicate(document, window.kommunicate || {});
    }
  }

  updateKommunicate() {
    // On this.props.user update -> change display of Kommunicate Widget
    let userId = this.props.user.id;
    window.Kommunicate?.displayKommunicateWidget(userId !== undefined);
    window.Kommunicate?.updateChatContext({user_id: userId?.toString()});

    if (userId === undefined) {
      window.Kommunicate?.logout();
    }
  }

  render() {
    return <></>
  }
}

export default KommunicateChat;
