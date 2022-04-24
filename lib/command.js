#!/usr/bin/env node
"use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}var events=_interopDefault(require("events")),child_process=_interopDefault(require("child_process")),path=_interopDefault(require("path")),fs=_interopDefault(require("fs")),process=_interopDefault(require("process"));function createCommonjsModule(t,e){return t(e={exports:{}},e.exports),e.exports}class CommanderError extends Error{constructor(t,e,i){super(i),Error.captureStackTrace(this,this.constructor),this.name=this.constructor.name,this.code=e,this.exitCode=t,this.nestedError=void 0}}class InvalidArgumentError extends CommanderError{constructor(t){super(1,"commander.invalidArgument",t),Error.captureStackTrace(this,this.constructor),this.name=this.constructor.name}}var CommanderError_1=CommanderError,InvalidArgumentError_1=InvalidArgumentError,error={CommanderError:CommanderError_1,InvalidArgumentError:InvalidArgumentError};const InvalidArgumentError$1=error["InvalidArgumentError"];class Argument{constructor(t,e){switch(this.description=e||"",this.variadic=!1,this.parseArg=void 0,this.defaultValue=void 0,this.defaultValueDescription=void 0,this.argChoices=void 0,t[0]){case"<":this.required=!0,this._name=t.slice(1,-1);break;case"[":this.required=!1,this._name=t.slice(1,-1);break;default:this.required=!0,this._name=t}3<this._name.length&&"..."===this._name.slice(-3)&&(this.variadic=!0,this._name=this._name.slice(0,-3))}name(){return this._name}_concatValue(t,e){return e!==this.defaultValue&&Array.isArray(e)?e.concat(t):[t]}default(t,e){return this.defaultValue=t,this.defaultValueDescription=e,this}argParser(t){return this.parseArg=t,this}choices(t){return this.argChoices=t.slice(),this.parseArg=(t,e)=>{if(this.argChoices.includes(t))return this.variadic?this._concatValue(t,e):t;throw new InvalidArgumentError$1(`Allowed choices are ${this.argChoices.join(", ")}.`)},this}argRequired(){return this.required=!0,this}argOptional(){return this.required=!1,this}}function humanReadableArgName(t){var e=t.name()+(!0===t.variadic?"...":"");return t.required?"<"+e+">":"["+e+"]"}var Argument_1=Argument,humanReadableArgName_1=humanReadableArgName,argument={Argument:Argument,humanReadableArgName:humanReadableArgName};const humanReadableArgName$1=argument["humanReadableArgName"];class Help{constructor(){this.helpWidth=void 0,this.sortSubcommands=!1,this.sortOptions=!1}visibleCommands(t){const e=t.commands.filter(t=>!t._hidden);if(t._hasImplicitHelpCommand()){var[,i,r]=t._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/);const n=t.createCommand(i).helpOption(!1);n.description(t._helpCommandDescription),r&&n.arguments(r),e.push(n)}return this.sortSubcommands&&e.sort((t,e)=>t.name().localeCompare(e.name())),e}visibleOptions(e){const i=e.options.filter(t=>!t.hidden);var r=e._hasHelpOption&&e._helpShortFlag&&!e._findOption(e._helpShortFlag),n=e._hasHelpOption&&!e._findOption(e._helpLongFlag);if(r||n){let t;t=r?n?e.createOption(e._helpFlags,e._helpDescription):e.createOption(e._helpShortFlag,e._helpDescription):e.createOption(e._helpLongFlag,e._helpDescription),i.push(t)}if(this.sortOptions){const s=t=>t.short?t.short.replace(/^-/,""):t.long.replace(/^--/,"");i.sort((t,e)=>s(t).localeCompare(s(e)))}return i}visibleArguments(e){return e._argsDescription&&e._args.forEach(t=>{t.description=t.description||e._argsDescription[t.name()]||""}),e._args.find(t=>t.description)?e._args:[]}subcommandTerm(t){var e=t._args.map(t=>humanReadableArgName$1(t)).join(" ");return t._name+(t._aliases[0]?"|"+t._aliases[0]:"")+(t.options.length?" [options]":"")+(e?" "+e:"")}optionTerm(t){return t.flags}argumentTerm(t){return t.name()}longestSubcommandTermLength(t,i){return i.visibleCommands(t).reduce((t,e)=>Math.max(t,i.subcommandTerm(e).length),0)}longestOptionTermLength(t,i){return i.visibleOptions(t).reduce((t,e)=>Math.max(t,i.optionTerm(e).length),0)}longestArgumentTermLength(t,i){return i.visibleArguments(t).reduce((t,e)=>Math.max(t,i.argumentTerm(e).length),0)}commandUsage(e){let t=e._name,i=(e._aliases[0]&&(t=t+"|"+e._aliases[0]),"");for(let t=e.parent;t;t=t.parent)i=t.name()+" "+i;return i+t+" "+e.usage()}commandDescription(t){return t.description()}subcommandDescription(t){return t.description()}optionDescription(t){const e=[];return t.argChoices&&e.push("choices: "+t.argChoices.map(t=>JSON.stringify(t)).join(", ")),void 0!==t.defaultValue&&(t.required||t.optional||t.isBoolean()&&"boolean"==typeof t.defaultValue)&&e.push("default: "+(t.defaultValueDescription||JSON.stringify(t.defaultValue))),void 0!==t.presetArg&&t.optional&&e.push("preset: "+JSON.stringify(t.presetArg)),void 0!==t.envVar&&e.push("env: "+t.envVar),0<e.length?`${t.description} (${e.join(", ")})`:t.description}argumentDescription(t){const e=[];var i;return t.argChoices&&e.push("choices: "+t.argChoices.map(t=>JSON.stringify(t)).join(", ")),void 0!==t.defaultValue&&e.push("default: "+(t.defaultValueDescription||JSON.stringify(t.defaultValue))),0<e.length?(i=`(${e.join(", ")})`,t.description?t.description+" "+i:i):t.description}formatHelp(t,i){const r=i.padWidth(t,i),n=i.helpWidth||80;function e(t,e){return e?(e=""+t.padEnd(r+2)+e,i.wrap(e,n-2,r+2)):t}function s(t){return t.join("\n").replace(/^/gm," ".repeat(2))}let o=["Usage: "+i.commandUsage(t),""];var a=i.commandDescription(t),a=(0<a.length&&(o=o.concat([a,""])),i.visibleArguments(t).map(t=>e(i.argumentTerm(t),i.argumentDescription(t)))),a=(0<a.length&&(o=o.concat(["Arguments:",s(a),""])),i.visibleOptions(t).map(t=>e(i.optionTerm(t),i.optionDescription(t)))),a=(0<a.length&&(o=o.concat(["Options:",s(a),""])),i.visibleCommands(t).map(t=>e(i.subcommandTerm(t),i.subcommandDescription(t))));return(o=0<a.length?o.concat(["Commands:",s(a),""]):o).join("\n")}padWidth(t,e){return Math.max(e.longestOptionTermLength(t,e),e.longestSubcommandTermLength(t,e),e.longestArgumentTermLength(t,e))}wrap(t,e,i,r=40){if(t.match(/[\n]\s+/))return t;e-=i;if(e<r)return t;r=t.substr(0,i);const n=t.substr(i),s=" ".repeat(i);t=new RegExp(".{1,"+(e-1)+"}([\\s​]|$)|[^\\s​]+?([\\s​]|$)","g");const o=n.match(t)||[];return r+o.map((t,e)=>("\n"===t.slice(-1)&&(t=t.slice(0,t.length-1)),(0<e?s:"")+t.trimRight())).join("\n")}}var Help_1=Help,help={Help:Help};const InvalidArgumentError$2=error["InvalidArgumentError"];class Option{constructor(t,e){this.flags=t,this.description=e||"",this.required=t.includes("<"),this.optional=t.includes("["),this.variadic=/\w\.\.\.[>\]]$/.test(t),this.mandatory=!1;e=splitOptionFlags(t);this.short=e.shortFlag,this.long=e.longFlag,this.negate=!1,this.long&&(this.negate=this.long.startsWith("--no-")),this.defaultValue=void 0,this.defaultValueDescription=void 0,this.presetArg=void 0,this.envVar=void 0,this.parseArg=void 0,this.hidden=!1,this.argChoices=void 0,this.conflictsWith=[]}default(t,e){return this.defaultValue=t,this.defaultValueDescription=e,this}preset(t){return this.presetArg=t,this}conflicts(t){return this.conflictsWith=this.conflictsWith.concat(t),this}env(t){return this.envVar=t,this}argParser(t){return this.parseArg=t,this}makeOptionMandatory(t=!0){return this.mandatory=!!t,this}hideHelp(t=!0){return this.hidden=!!t,this}_concatValue(t,e){return e!==this.defaultValue&&Array.isArray(e)?e.concat(t):[t]}choices(t){return this.argChoices=t.slice(),this.parseArg=(t,e)=>{if(this.argChoices.includes(t))return this.variadic?this._concatValue(t,e):t;throw new InvalidArgumentError$2(`Allowed choices are ${this.argChoices.join(", ")}.`)},this}name(){return this.long?this.long.replace(/^--/,""):this.short.replace(/^-/,"")}attributeName(){return camelcase(this.name().replace(/^no-/,""))}is(t){return this.short===t||this.long===t}isBoolean(){return!this.required&&!this.optional&&!this.negate}}function camelcase(t){return t.split("-").reduce((t,e)=>t+e[0].toUpperCase()+e.slice(1))}function splitOptionFlags(t){let e,i;const r=t.split(/[ |,]+/);return 1<r.length&&!/^[[<]/.test(r[1])&&(e=r.shift()),i=r.shift(),!e&&/^-[^-]$/.test(i)&&(e=i,i=void 0),{shortFlag:e,longFlag:i}}var Option_1=Option,splitOptionFlags_1=splitOptionFlags,option={Option:Option,splitOptionFlags:splitOptionFlags};const maxDistance=3;function editDistance(r,n){if(Math.abs(r.length-n.length)>maxDistance)return Math.max(r.length,n.length);const s=[];for(let t=0;t<=r.length;t++)s[t]=[t];for(let t=0;t<=n.length;t++)s[0][t]=t;for(let i=1;i<=n.length;i++)for(let e=1;e<=r.length;e++){let t=1;t=r[e-1]===n[i-1]?0:1,s[e][i]=Math.min(s[e-1][i]+1,s[e][i-1]+1,s[e-1][i-1]+t),1<e&&1<i&&r[e-1]===n[i-2]&&r[e-2]===n[i-1]&&(s[e][i]=Math.min(s[e][i],s[e-2][i-2]+1))}return s[r.length][n.length]}function suggestSimilar(r,t){if(!t||0===t.length)return"";t=Array.from(new Set(t));var e=r.startsWith("--");e&&(r=r.slice(2),t=t.map(t=>t.slice(2)));let n=[],s=maxDistance;return t.forEach(t=>{var e,i;t.length<=1||(e=editDistance(r,t),.4<((i=Math.max(r.length,t.length))-e)/i&&(e<s?(s=e,n=[t]):e===s&&n.push(t)))}),n.sort((t,e)=>t.localeCompare(e)),1<(n=e?n.map(t=>"--"+t):n).length?`
(Did you mean one of ${n.join(", ")}?)`:1===n.length?`
(Did you mean ${n[0]}?)`:""}var suggestSimilar_2=suggestSimilar,suggestSimilar_1={suggestSimilar:suggestSimilar};const EventEmitter=events.EventEmitter,{Argument:Argument$1,humanReadableArgName:humanReadableArgName$2}=argument,CommanderError$1=error["CommanderError"],Help$1=help["Help"],{Option:Option$1,splitOptionFlags:splitOptionFlags$1}=option,suggestSimilar$1=suggestSimilar_1["suggestSimilar"];class Command extends EventEmitter{constructor(t){super(),this.commands=[],this.options=[],this.parent=null,this._allowUnknownOption=!1,this._allowExcessArguments=!0,this._args=[],this.args=[],this.rawArgs=[],this.processedArgs=[],this._scriptPath=null,this._name=t||"",this._optionValues={},this._optionValueSources={},this._storeOptionsAsProperties=!1,this._actionHandler=null,this._executableHandler=!1,this._executableFile=null,this._executableDir=null,this._defaultCommandName=null,this._exitCallback=null,this._aliases=[],this._combineFlagAndOptionalValue=!0,this._description="",this._argsDescription=void 0,this._enablePositionalOptions=!1,this._passThroughOptions=!1,this._lifeCycleHooks={},this._showHelpAfterError=!1,this._showSuggestionAfterError=!0,this._outputConfiguration={writeOut:t=>process.stdout.write(t),writeErr:t=>process.stderr.write(t),getOutHelpWidth:()=>process.stdout.isTTY?process.stdout.columns:void 0,getErrHelpWidth:()=>process.stderr.isTTY?process.stderr.columns:void 0,outputError:(t,e)=>e(t)},this._hidden=!1,this._hasHelpOption=!0,this._helpFlags="-h, --help",this._helpDescription="display help for command",this._helpShortFlag="-h",this._helpLongFlag="--help",this._addImplicitHelpCommand=void 0,this._helpCommandName="help",this._helpCommandnameAndArgs="help [command]",this._helpCommandDescription="display help for command",this._helpConfiguration={}}copyInheritedSettings(t){return this._outputConfiguration=t._outputConfiguration,this._hasHelpOption=t._hasHelpOption,this._helpFlags=t._helpFlags,this._helpDescription=t._helpDescription,this._helpShortFlag=t._helpShortFlag,this._helpLongFlag=t._helpLongFlag,this._helpCommandName=t._helpCommandName,this._helpCommandnameAndArgs=t._helpCommandnameAndArgs,this._helpCommandDescription=t._helpCommandDescription,this._helpConfiguration=t._helpConfiguration,this._exitCallback=t._exitCallback,this._storeOptionsAsProperties=t._storeOptionsAsProperties,this._combineFlagAndOptionalValue=t._combineFlagAndOptionalValue,this._allowExcessArguments=t._allowExcessArguments,this._enablePositionalOptions=t._enablePositionalOptions,this._showHelpAfterError=t._showHelpAfterError,this._showSuggestionAfterError=t._showSuggestionAfterError,this}command(t,e,i){let r=e,n=i;"object"==typeof r&&null!==r&&(n=r,r=null),n=n||{};var[,e,i]=t.match(/([^ ]+) *(.*)/);const s=this.createCommand(e);return r&&(s.description(r),s._executableHandler=!0),n.isDefault&&(this._defaultCommandName=s._name),s._hidden=!(!n.noHelp&&!n.hidden),s._executableFile=n.executableFile||null,i&&s.arguments(i),this.commands.push(s),s.parent=this,s.copyInheritedSettings(this),r?this:s}createCommand(t){return new Command(t)}createHelp(){return Object.assign(new Help$1,this.configureHelp())}configureHelp(t){return void 0===t?this._helpConfiguration:(this._helpConfiguration=t,this)}configureOutput(t){return void 0===t?this._outputConfiguration:(Object.assign(this._outputConfiguration,t),this)}showHelpAfterError(t=!0){return this._showHelpAfterError=t="string"!=typeof t?!!t:t,this}showSuggestionAfterError(t=!0){return this._showSuggestionAfterError=!!t,this}addCommand(t,e){if(t._name)return(e=e||{}).isDefault&&(this._defaultCommandName=t._name),(e.noHelp||e.hidden)&&(t._hidden=!0),this.commands.push(t),t.parent=this;throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`)}createArgument(t,e){return new Argument$1(t,e)}argument(t,e,i,r){const n=this.createArgument(t,e);return"function"==typeof i?n.default(r).argParser(i):n.default(i),this.addArgument(n),this}arguments(t){return t.split(/ +/).forEach(t=>{this.argument(t)}),this}addArgument(t){const e=this._args.slice(-1)[0];if(e&&e.variadic)throw new Error(`only the last argument can be variadic '${e.name()}'`);if(t.required&&void 0!==t.defaultValue&&void 0===t.parseArg)throw new Error(`a default value for a required argument is never used: '${t.name()}'`);return this._args.push(t),this}addHelpCommand(t,e){return!1===t?this._addImplicitHelpCommand=!1:(this._addImplicitHelpCommand=!0,"string"==typeof t&&(this._helpCommandName=t.split(" ")[0],this._helpCommandnameAndArgs=t),this._helpCommandDescription=e||this._helpCommandDescription),this}_hasImplicitHelpCommand(){return void 0===this._addImplicitHelpCommand?this.commands.length&&!this._actionHandler&&!this._findCommand("help"):this._addImplicitHelpCommand}hook(t,e){const i=["preAction","postAction"];if(i.includes(t))return this._lifeCycleHooks[t]?this._lifeCycleHooks[t].push(e):this._lifeCycleHooks[t]=[e],this;throw new Error(`Unexpected value for event passed to hook : '${t}'.
Expecting one of '${i.join("', '")}'`)}exitOverride(t){return this._exitCallback=t||(t=>{if("commander.executeSubCommandAsync"!==t.code)throw t}),this}_exit(t,e,i){this._exitCallback&&this._exitCallback(new CommanderError$1(t,e,i)),process.exit(t)}action(r){return this._actionHandler=t=>{var e=this._args.length;const i=t.slice(0,e);return this._storeOptionsAsProperties?i[e]=this:i[e]=this.opts(),i.push(this),r.apply(this,i)},this}createOption(t,e){return new Option$1(t,e)}addOption(n){var t,e=n.name();const s=n.attributeName(),i=(n.negate?(t=n.long.replace(/^--no-/,"--"),this._findOption(t)||this.setOptionValueWithSource(s,void 0===n.defaultValue||n.defaultValue,"default")):void 0!==n.defaultValue&&this.setOptionValueWithSource(s,n.defaultValue,"default"),this.options.push(n),(t,e,i)=>{null==t&&void 0!==n.presetArg&&(t=n.presetArg);var r=this.getOptionValue(s);if(null!==t&&n.parseArg)try{t=n.parseArg(t,r)}catch(t){throw"commander.invalidArgument"===t.code&&(e=e+" "+t.message,this.error(e,{exitCode:t.exitCode,code:t.code})),t}else null!==t&&n.variadic&&(t=n._concatValue(t,r));null==t&&(t=!n.negate&&(!(!n.isBoolean()&&!n.optional)||"")),this.setOptionValueWithSource(s,t,i)});return this.on("option:"+e,t=>{var e=`error: option '${n.flags}' argument '${t}' is invalid.`;i(t,e,"cli")}),n.envVar&&this.on("optionEnv:"+e,t=>{var e=`error: option '${n.flags}' value '${t}' from env '${n.envVar}' is invalid.`;i(t,e,"env")}),this}_optionEx(t,e,i,r,n){if("object"==typeof e&&e instanceof Option$1)throw new Error("To add an Option object use addOption() instead of option() or requiredOption()");const s=this.createOption(e,i);if(s.makeOptionMandatory(!!t.mandatory),"function"==typeof r)s.default(n).argParser(r);else if(r instanceof RegExp){const o=r;r=(t,e)=>{t=o.exec(t);return t?t[0]:e},s.default(n).argParser(r)}else s.default(r);return this.addOption(s)}option(t,e,i,r){return this._optionEx({},t,e,i,r)}requiredOption(t,e,i,r){return this._optionEx({mandatory:!0},t,e,i,r)}combineFlagAndOptionalValue(t=!0){return this._combineFlagAndOptionalValue=!!t,this}allowUnknownOption(t=!0){return this._allowUnknownOption=!!t,this}allowExcessArguments(t=!0){return this._allowExcessArguments=!!t,this}enablePositionalOptions(t=!0){return this._enablePositionalOptions=!!t,this}passThroughOptions(t=!0){if(this._passThroughOptions=!!t,this.parent&&t&&!this.parent._enablePositionalOptions)throw new Error("passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)");return this}storeOptionsAsProperties(t=!0){if(this._storeOptionsAsProperties=!!t,this.options.length)throw new Error("call .storeOptionsAsProperties() before adding options");return this}getOptionValue(t){return(this._storeOptionsAsProperties?this:this._optionValues)[t]}setOptionValue(t,e){return this._storeOptionsAsProperties?this[t]=e:this._optionValues[t]=e,this}setOptionValueWithSource(t,e,i){return this.setOptionValue(t,e),this._optionValueSources[t]=i,this}getOptionValueSource(t){return this._optionValueSources[t]}_prepareUserArgs(t,e){if(void 0!==t&&!Array.isArray(t))throw new Error("first parameter to parse must be array or undefined");e=e||{},void 0===t&&(t=process.argv,process.versions&&process.versions.electron&&(e.from="electron")),this.rawArgs=t.slice();let i;switch(e.from){case void 0:case"node":this._scriptPath=t[1],i=t.slice(2);break;case"electron":i=process.defaultApp?(this._scriptPath=t[1],t.slice(2)):t.slice(1);break;case"user":i=t.slice(0);break;default:throw new Error(`unexpected parse option { from: '${e.from}' }`)}return!this._name&&this._scriptPath&&this.nameFromFilename(this._scriptPath),this._name=this._name||"program",i}parse(t,e){t=this._prepareUserArgs(t,e);return this._parseCommand([],t),this}async parseAsync(t,e){t=this._prepareUserArgs(t,e);return await this._parseCommand([],t),this}_executeSubCommand(r,t){t=t.slice();var e;const n=[".js",".ts",".tsx",".mjs",".cjs"];function i(t,e){const i=path.resolve(t,e);if(fs.existsSync(i))return i;if(!n.includes(path.extname(e)))return t=n.find(t=>fs.existsSync(""+i+t)),t?""+i+t:void 0}this._checkForMissingMandatoryOptions();let s=r._executableFile||this._name+"-"+r._name,o=this._executableDir||"";if(this._scriptPath){let e;try{e=fs.realpathSync(this._scriptPath)}catch(t){e=this._scriptPath}o=path.resolve(path.dirname(e),o)}if(o){let t=i(o,s);t||r._executableFile||!this._scriptPath||(e=path.basename(this._scriptPath,path.extname(this._scriptPath)))!==this._name&&(t=i(o,e+"-"+r._name)),s=t||s}e=n.includes(path.extname(s));let a;if(!(a="win32"!==process.platform?e?(t.unshift(s),t=incrementNodeInspectorPort(process.execArgv).concat(t),child_process.spawn(process.argv[0],t,{stdio:"inherit"})):child_process.spawn(s,t,{stdio:"inherit"}):(t.unshift(s),t=incrementNodeInspectorPort(process.execArgv).concat(t),child_process.spawn(process.execPath,t,{stdio:"inherit"}))).killed){const l=["SIGUSR1","SIGUSR2","SIGTERM","SIGINT","SIGHUP"];l.forEach(t=>{process.on(t,()=>{!1===a.killed&&null===a.exitCode&&a.kill(t)})})}const h=this._exitCallback;h?a.on("close",()=>{h(new CommanderError$1(process.exitCode||0,"commander.executeSubCommandAsync","(close)"))}):a.on("close",process.exit.bind(process)),a.on("error",t=>{var e;if("ENOENT"===t.code)throw e=o?`searched for local subcommand relative to directory '${o}'`:"no directory for search for local subcommand, use .executableDir() to supply a custom directory",e=`'${s}' does not exist
 - if '${r._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - `+e,new Error(e);if("EACCES"===t.code)throw new Error(`'${s}' not executable`);if(h){const i=new CommanderError$1(1,"commander.executeSubCommandAsync","(error)");i.nestedError=t,h(i)}else process.exit(1)}),this.runningCommand=a}_dispatchSubcommand(t,e,i){const r=this._findCommand(t);if(r||this.help({error:!0}),!r._executableHandler)return r._parseCommand(e,i);this._executeSubCommand(r,e.concat(i))}_checkNumberOfArguments(){this._args.forEach((t,e)=>{t.required&&null==this.args[e]&&this.missingArgument(t.name())}),0<this._args.length&&this._args[this._args.length-1].variadic||this.args.length>this._args.length&&this._excessArguments(this.args)}_processArguments(){const r=(e,i,r)=>{let t=i;if(null!==i&&e.parseArg)try{t=e.parseArg(i,r)}catch(t){throw"commander.invalidArgument"===t.code&&(r=`error: command-argument value '${i}' is invalid for argument '${e.name()}'. `+t.message,this.error(r,{exitCode:t.exitCode,code:t.code})),t}return t},n=(this._checkNumberOfArguments(),[]);this._args.forEach((i,t)=>{let e=i.defaultValue;i.variadic?t<this.args.length?(e=this.args.slice(t),i.parseArg&&(e=e.reduce((t,e)=>r(i,e,t),i.defaultValue))):void 0===e&&(e=[]):t<this.args.length&&(e=this.args[t],i.parseArg&&(e=r(i,e,i.defaultValue))),n[t]=e}),this.processedArgs=n}_chainOrCall(t,e){return t&&t.then&&"function"==typeof t.then?t.then(()=>e()):e()}_chainOrCallHooks(t,i){let e=t;const r=[];return getCommandAndParents(this).reverse().filter(t=>void 0!==t._lifeCycleHooks[i]).forEach(e=>{e._lifeCycleHooks[i].forEach(t=>{r.push({hookedCommand:e,callback:t})})}),"postAction"===i&&r.reverse(),r.forEach(t=>{e=this._chainOrCall(e,()=>t.callback(t.hookedCommand,this))}),e}_parseCommand(e,i){const t=this.parseOptions(i);if(this._parseOptionsEnv(),e=e.concat(t.operands),i=t.unknown,this.args=e.concat(i),e&&this._findCommand(e[0]))return this._dispatchSubcommand(e[0],e.slice(1),i);if(this._hasImplicitHelpCommand()&&e[0]===this._helpCommandName)return 1===e.length&&this.help(),this._dispatchSubcommand(e[1],[],[this._helpLongFlag]);if(this._defaultCommandName)return outputHelpIfRequested(this,i),this._dispatchSubcommand(this._defaultCommandName,e,i);!this.commands.length||0!==this.args.length||this._actionHandler||this._defaultCommandName||this.help({error:!0}),outputHelpIfRequested(this,t.unknown),this._checkForMissingMandatoryOptions(),this._checkForConflictingOptions();var r=()=>{0<t.unknown.length&&this.unknownOption(t.unknown[0])};const n="command:"+this.name();if(this._actionHandler){r(),this._processArguments();let t;return t=this._chainOrCallHooks(t,"preAction"),t=this._chainOrCall(t,()=>this._actionHandler(this.processedArgs)),this.parent&&(t=this._chainOrCall(t,()=>{this.parent.emit(n,e,i)})),t=this._chainOrCallHooks(t,"postAction")}if(this.parent&&this.parent.listenerCount(n))r(),this._processArguments(),this.parent.emit(n,e,i);else if(e.length){if(this._findCommand("*"))return this._dispatchSubcommand("*",e,i);this.listenerCount("command:*")?this.emit("command:*",e,i):this.commands.length?this.unknownCommand():(r(),this._processArguments())}else this.commands.length?(r(),this.help({error:!0})):(r(),this._processArguments())}_findCommand(e){if(e)return this.commands.find(t=>t._name===e||t._aliases.includes(e))}_findOption(e){return this.options.find(t=>t.is(e))}_checkForMissingMandatoryOptions(){for(let e=this;e;e=e.parent)e.options.forEach(t=>{t.mandatory&&void 0===e.getOptionValue(t.attributeName())&&e.missingMandatoryOptionValue(t)})}_checkForConflictingOptions(){const i=this.options.filter(t=>{t=t.attributeName();return void 0!==this.getOptionValue(t)&&"default"!==this.getOptionValueSource(t)}),t=i.filter(t=>0<t.conflictsWith.length);t.forEach(e=>{var t=i.find(t=>e.conflictsWith.includes(t.attributeName()));t&&this._conflictingOption(e,t)})}parseOptions(t){const e=[],i=[];let r=e;const n=t.slice();function s(t){return 1<t.length&&"-"===t[0]}let o=null;for(;n.length;){const h=n.shift();if("--"===h){r===i&&r.push(h),r.push(...n);break}if(o&&!s(h))this.emit("option:"+o.name(),h);else{if(o=null,s(h)){const l=this._findOption(h);if(l){if(l.required){var a=n.shift();void 0===a&&this.optionMissingArgument(l),this.emit("option:"+l.name(),a)}else if(l.optional){let t=null;0<n.length&&!s(n[0])&&(t=n.shift()),this.emit("option:"+l.name(),t)}else this.emit("option:"+l.name());o=l.variadic?l:null;continue}}if(2<h.length&&"-"===h[0]&&"-"!==h[1]){const p=this._findOption("-"+h[1]);if(p){p.required||p.optional&&this._combineFlagAndOptionalValue?this.emit("option:"+p.name(),h.slice(2)):(this.emit("option:"+p.name()),n.unshift("-"+h.slice(2)));continue}}if(/^--[^=]+=/.test(h)){a=h.indexOf("=");const m=this._findOption(h.slice(0,a));if(m&&(m.required||m.optional)){this.emit("option:"+m.name(),h.slice(a+1));continue}}if(s(h)&&(r=i),(this._enablePositionalOptions||this._passThroughOptions)&&0===e.length&&0===i.length){if(this._findCommand(h)){e.push(h),0<n.length&&i.push(...n);break}if(h===this._helpCommandName&&this._hasImplicitHelpCommand()){e.push(h),0<n.length&&e.push(...n);break}if(this._defaultCommandName){i.push(h),0<n.length&&i.push(...n);break}}if(this._passThroughOptions){r.push(h),0<n.length&&r.push(...n);break}r.push(h)}}return{operands:e,unknown:i}}opts(){if(this._storeOptionsAsProperties){const r={};var e=this.options.length;for(let t=0;t<e;t++){var i=this.options[t].attributeName();r[i]=i===this._versionOptionName?this._version:this[i]}return r}return this._optionValues}optsWithGlobals(){return getCommandAndParents(this).reduce((t,e)=>Object.assign(t,e.opts()),{})}error(t,e){this._outputConfiguration.outputError(t+`
`,this._outputConfiguration.writeErr),"string"==typeof this._showHelpAfterError?this._outputConfiguration.writeErr(this._showHelpAfterError+`
`):this._showHelpAfterError&&(this._outputConfiguration.writeErr("\n"),this.outputHelp({error:!0}));var e=e||{},i=e.exitCode||1,e=e.code||"commander.error";this._exit(i,e,t)}_parseOptionsEnv(){this.options.forEach(t=>{var e;t.envVar&&t.envVar in process.env&&(e=t.attributeName(),void 0!==this.getOptionValue(e)&&!["default","config","env"].includes(this.getOptionValueSource(e))||(t.required||t.optional?this.emit("optionEnv:"+t.name(),process.env[t.envVar]):this.emit("optionEnv:"+t.name())))})}missingArgument(t){this.error(`error: missing required argument '${t}'`,{code:"commander.missingArgument"})}optionMissingArgument(t){t=`error: option '${t.flags}' argument missing`;this.error(t,{code:"commander.optionMissingArgument"})}missingMandatoryOptionValue(t){t=`error: required option '${t.flags}' not specified`;this.error(t,{code:"commander.missingMandatoryOptionValue"})}_conflictingOption(t,e){const i=t=>{const e=t.attributeName();var i=this.getOptionValue(e),r=this.options.find(t=>t.negate&&e===t.attributeName()),n=this.options.find(t=>!t.negate&&e===t.attributeName());return r&&(void 0===r.presetArg&&!1===i||void 0!==r.presetArg&&i===r.presetArg)?r:n||t};var r=t=>{const e=i(t);t=e.attributeName();return"env"===this.getOptionValueSource(t)?`environment variable '${e.envVar}'`:`option '${e.flags}'`},t=`error: ${r(t)} cannot be used with `+r(e);this.error(t,{code:"commander.conflictingOption"})}unknownOption(r){if(!this._allowUnknownOption){let i="";if(r.startsWith("--")&&this._showSuggestionAfterError){let t=[],e=this;do{var n=e.createHelp().visibleOptions(e).filter(t=>t.long).map(t=>t.long);t=t.concat(n),e=e.parent}while(e&&!e._enablePositionalOptions);i=suggestSimilar$1(r,t)}r=`error: unknown option '${r}'`+i;this.error(r,{code:"commander.unknownOption"})}}_excessArguments(t){var e,i;this._allowExcessArguments||(e=1===(i=this._args.length)?"":"s",i=`error: too many arguments${this.parent?` for '${this.name()}'`:""}. Expected ${i} argument${e} but got ${t.length}.`,this.error(i,{code:"commander.excessArguments"}))}unknownCommand(){var t=this.args[0];let e="";if(this._showSuggestionAfterError){const i=[];this.createHelp().visibleCommands(this).forEach(t=>{i.push(t.name()),t.alias()&&i.push(t.alias())}),e=suggestSimilar$1(t,i)}t=`error: unknown command '${t}'`+e;this.error(t,{code:"commander.unknownCommand"})}version(t,e,i){if(void 0===t)return this._version;this._version=t;const r=this.createOption(e=e||"-V, --version",i=i||"output the version number");return this._versionOptionName=r.attributeName(),this.options.push(r),this.on("option:"+r.name(),()=>{this._outputConfiguration.writeOut(t+`
`),this._exit(0,"commander.version",t)}),this}description(t,e){return void 0===t&&void 0===e?this._description:(this._description=t,e&&(this._argsDescription=e),this)}alias(t){if(void 0===t)return this._aliases[0];let e=this;if(t===(e=0!==this.commands.length&&this.commands[this.commands.length-1]._executableHandler?this.commands[this.commands.length-1]:e)._name)throw new Error("Command alias can't be the same as its name");return e._aliases.push(t),this}aliases(t){return void 0===t?this._aliases:(t.forEach(t=>this.alias(t)),this)}usage(t){if(void 0!==t)return this._usage=t,this;if(this._usage)return this._usage;t=this._args.map(t=>humanReadableArgName$2(t));return[].concat(this.options.length||this._hasHelpOption?"[options]":[],this.commands.length?"[command]":[],this._args.length?t:[]).join(" ")}name(t){return void 0===t?this._name:(this._name=t,this)}nameFromFilename(t){return this._name=path.basename(t,path.extname(t)),this}executableDir(t){return void 0===t?this._executableDir:(this._executableDir=t,this)}helpInformation(t){const e=this.createHelp();return void 0===e.helpWidth&&(e.helpWidth=t&&t.error?this._outputConfiguration.getErrHelpWidth():this._outputConfiguration.getOutHelpWidth()),e.formatHelp(this,e)}_getHelpContext(t){const e={error:!!(t=t||{}).error};let i;return i=e.error?t=>this._outputConfiguration.writeErr(t):t=>this._outputConfiguration.writeOut(t),e.write=t.write||i,e.command=this,e}outputHelp(t){let e;"function"==typeof t&&(e=t,t=void 0);const i=this._getHelpContext(t);getCommandAndParents(this).reverse().forEach(t=>t.emit("beforeAllHelp",i)),this.emit("beforeHelp",i);let r=this.helpInformation(i);if(e&&"string"!=typeof(r=e(r))&&!Buffer.isBuffer(r))throw new Error("outputHelp callback must return a string or a Buffer");i.write(r),this.emit(this._helpLongFlag),this.emit("afterHelp",i),getCommandAndParents(this).forEach(t=>t.emit("afterAllHelp",i))}helpOption(t,e){if("boolean"==typeof t)return this._hasHelpOption=t,this;this._helpFlags=t||this._helpFlags,this._helpDescription=e||this._helpDescription;t=splitOptionFlags$1(this._helpFlags);return this._helpShortFlag=t.shortFlag,this._helpLongFlag=t.longFlag,this}help(t){this.outputHelp(t);let e=process.exitCode||0;0===e&&t&&"function"!=typeof t&&t.error&&(e=1),this._exit(e,"commander.help","(outputHelp)")}addHelpText(t,i){const e=["beforeAll","before","after","afterAll"];if(e.includes(t))return this.on(t+"Help",t=>{let e;(e="function"==typeof i?i({error:t.error,command:t.command}):i)&&t.write(e+`
`)}),this;throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${e.join("', '")}'`)}}function outputHelpIfRequested(e,t){e._hasHelpOption&&t.find(t=>t===e._helpLongFlag||t===e._helpShortFlag)&&(e.outputHelp(),e._exit(0,"commander.helpDisplayed","(outputHelp)"))}function incrementNodeInspectorPort(t){return t.map(t=>{if(!t.startsWith("--inspect"))return t;let e,i="127.0.0.1",r="9229",n;return null!==(n=t.match(/^(--inspect(-brk)?)$/))?e=n[1]:null!==(n=t.match(/^(--inspect(-brk|-port)?)=([^:]+)$/))?(e=n[1],/^\d+$/.test(n[3])?r=n[3]:i=n[3]):null!==(n=t.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/))&&(e=n[1],i=n[3],r=n[4]),e&&"0"!==r?`${e}=${i}:`+(parseInt(r)+1):t})}function getCommandAndParents(e){const i=[];for(let t=e;t;t=t.parent)i.push(t);return i}var Command_1=Command,command={Command:Command},commander=createCommonjsModule(function(t,e){var i=argument["Argument"];const r=command["Command"];var{CommanderError:n,InvalidArgumentError:s}=error,o=help["Help"],a=option["Option"];((e=t.exports=new r).program=e).Argument=i,e.Command=r,e.CommanderError=n,e.Help=o,e.InvalidArgumentError=s,e.InvalidOptionArgumentError=s,e.Option=a}),commander_1=commander.program,commander_2=commander.Argument,commander_3=commander.Command,commander_4=commander.CommanderError,commander_5=commander.Help,commander_6=commander.InvalidArgumentError,commander_7=commander.InvalidOptionArgumentError,commander_8=commander.Option,program=(console.log(1111),new commander_3);program.version("1.0.0"),program.command("clone <source> [destination]").description("clone a repository into a newly created directory").action(function(t,e){console.log("clone command called")});
//# sourceMappingURL=command.js.map