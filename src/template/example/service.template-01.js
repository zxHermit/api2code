// 模板语法 https://aui.github.io/art-template/zh-cn/
import ServiceBase from '@/common/service.base';

const ApiList = {
{{each interfaceList}}
    // {{ $value.title }}
    {{$value.name}}: {
        url: "{{ $value.path }}",
        method: "{{ $value.method }}"
    },
{{/each}}
};

export default new ServiceBase(ApiList);
