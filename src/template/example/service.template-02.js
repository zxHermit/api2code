// 模板语法 https://aui.github.io/art-template/zh-cn/
import axios from 'axios';

{{each interfaceList}}
// {{ $value.title }}
export const {{$value.name}} = async (data) => {
    return await axios({
        url: "{{ $value.path }}",
        method: "{{ $value.method }}",
        {{if $value.method === 'GET'}}params: data,{{/if}}
        {{if $value.method === 'POST'}}data: data,{{/if}}
    });
}
{{/each}}
