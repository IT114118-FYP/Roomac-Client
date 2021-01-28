import i18n from "./index";
import { Select } from 'antd';

const { Option } = Select;

const languages = {'en': 'English', 'hk': '繁體中文', 'cn': '简体中文'}

const getTranslatedString = (obj, string) => {
  var translated = obj[string + '_' + i18n.language];
  return translated && translated.length > 0 ? translated : obj[string + '_en'];
}

let languageOptions = [];
for (let key in languages) {
    languageOptions.push(<Option key={key} value={key}>{languages[key]}</Option>);
}

export { languages, languageOptions, getTranslatedString };
  