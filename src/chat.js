import { React, Component } from "react";

class KommunicateChat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let userId = this.props.user.id;

    (function(d,m){
      var kommunicateSettings = {
        "appId": "34ed33c5a3d77be45defccb8514c422a5",
        onInit: function() {
          var chatContext = {
            user_id: userId?.toString(),
          };
          window.Kommunicate.updateChatContext(chatContext);
          window.Kommunicate.displayKommunicateWidget(userId !== undefined);
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
    })(document, window.kommunicate || {});
  }

  componentDidUpdate() {
    // On this.props.user update -> change display of Kommunicate Widget
    window.Kommunicate.displayKommunicateWidget(this.props.user.id !== undefined);
  }

  render() {
    return <></>
  }
}

export default KommunicateChat;
