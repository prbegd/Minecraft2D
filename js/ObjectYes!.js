(function (_Scratch) {
    //非沙盒
    'use strict';

    //初始化值
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    const CLASS = 0, INTERFACE = 1, ENUM = 2, ABSTRACT_CLASS = 3,
        METHOD = 0, STATIC_METHOD = 1, CONSTRUCTOR = 2, ABSTRACT_METHOD = 3,
        PUBLIC = 0, PROTECTED = 1, PRIVATE = 2;

    translate.setup({
        zh: {
            "description": "添加了一些与面向对象有关的积木",
            "createClass": "创建名为[NAME]的[TYPE],访问权限为[ACCESS_PERMISSIONS],继承自[EXTENDS],实现接口[IMPLEMENTS]",
            "getClassesJSON": "获取所有类(JSON)",
            "createMethod": "在[CLASS_NAME]中创建名为[METHOD_NAME]的[METHOD_TYPE],访问权限为[METHOD_ACCESS_PERMISSIONS],返回值类型为[METHOD_RETURN_TYPE],是final为[METHOD_FINAL],参数为[args]",

            "createClass.tooltip": "类类型的值依次为:0,1,2,3,访问权限的值依次为:0,1,2。\n继承类只能写一个,如果为空则看做继承于Object。实现接口可以写多个,按照英文逗号\",\"分割。",
            "createMethod.tooltip": "方法类型的值依次为:0,1,2,3,访问权限的值依次为:0,1,2,3.\n返回值类型为:String,Boolean,Number和其他类,参数格式:\"参数名1:参数类型1, 参数名2:参数类型2, ...\"。",

            "classType.class": "类",
            "classType.interface": "接口",
            "classType.enum": "枚举",
            "classType.abstractClass": "抽象类",
            "methodType.method": "方法",
            "methodType.staticMethod": "静态方法",
            "methodType.constructor": "构造方法",
            "methodType.abstractMethod": "抽象方法",
            "AccessPermissions.public": "所有位置均可访问",
            "AccessPermissions.protected": "只能在同角色内访问",
            "AccessPermissions.private": "只能在同类内访问",

            "empty": "无",

            "text1": "定义"
        }, en: {
            "description": "Added some object-oriented building blocks.",
            "createClass": "Create a [TYPE] named [NAME], access permissions are [ACCESS_PERMISSIONS], extends from [EXTENDS], implements [IMPLEMENTS]",
            "getClassesJSON": "Get all classes (JSON)",
            "createMethod": "Create a [METHOD_TYPE] named [METHOD_NAME] in [CLASS_NAME], access permissions are [METHOD_ACCESS_PERMISSIONS], return type is [METHOD_RETURN_TYPE], is final [METHOD_FINAL], parameters are [args]",

            "createClass.tooltip": "Class type values are: 0, 1, 2, 3, access permissions are: 0, 1, 2. \nThe inherited class can only be written once, if it is empty, it is considered to inherit from Object. Implement interfaces can be written multiple times, separated by commas \",\".",
            "createMethod.tooltip": "Method type values are: 0, 1, 2, 3, access permissions are: 0, 1, 2, 3. \nReturn type is: String, Boolean, Number and other classes, parameters are: \"Parameter name 1: Parameter type 1, Parameter name 2: Parameter type 2, ...\"",

            "classType.class": "class",
            "classType.interface": "interface",
            "classType.enum": "enum",
            "classType.abstractClass": "abstract class",
            "methodType.method": "method",
            "methodType.staticMethod": "static method",
            "methodType.constructor": "constructor",
            "methodType.abstractMethod": "abstract method",
            "AccessPermissions.public": "All positions can be accessed",
            "AccessPermissions.protected": "Can only be accessed within the same sprite",
            "AccessPermissions.private": "Can only be accessed within the same class",

            "empty": "Empty",

            "text1": "define"
        }
    });

    class ObjectYes {
        // 类列表
        classList = [{
            ClassName: "Object",
            ClassType: CLASS,
            AccessPermissions: PUBLIC,
            Extends: "",
            Implements: [],
            Fields: [],
            Methods: [{
                MethodName: "toString",
                MethodType: METHOD,
                AccessPermissions: PUBLIC,
                Parameters: [],
                ReturnType: "String",
                Final: false,
                Native: true
            }, {
                MethodName: "equals",
                MethodType: METHOD,
                AccessPermissions: PUBLIC,
                Final: false,
                Native: true,
                ReturnType: "Boolean",
                Parameters: [{
                    ParameterName: "obj", ParameterType: "Object"
                }]
            }],
            VirtualMethods: []
        }]
        objectList = [{
            index: 0,
            ClassName: "Object",
            Fields: []
        }]

        // 方法

        constructor(_runtime) {
            this._runtime = _runtime;
        }

        getInfo() {
            // 积木常量定义
            const createClass = {
                opcode: 'createClass',
                blockType: BlockType.COMMAND,
                text: translate({id: 'createClass'}),
                tooltip: translate({id: 'createClass.tooltip'}),
                arguments: {
                    NAME: {
                        type: ArgumentType.STRING, defaultValue: 'Number'
                    }, TYPE: {
                        type: ArgumentType.NUMBER, menu: 'classType'
                    }, ACCESS_PERMISSIONS: {
                        type: ArgumentType.NUMBER, menu: 'AccessPermissions'
                    }, EXTENDS: {
                        type: ArgumentType.STRING, menu: 'classesWithAbstract'      //类名,只写一个 为空则默认继承于Object
                    }, IMPLEMENTS: {
                        type: ArgumentType.STRING, menu: "interfaces"//接口名,用逗号分隔 为空则不实现接口
                    }
                }
            }
            const getClassesJSON = {
                opcode: 'getClassesJSON',
                blockType: BlockType.REPORTER,
                text: translate({id: 'getClassesJSON'}),
                tooltip: translate({id: 'getClassesJSON.tooltip'}),
                arguments: {}
            }
            const createMethod = {
                opcode: 'createMethod',
                blockType: BlockType.HAT,
                text: translate({id: 'createMethod'}),
                "tooltip": translate({id: 'createMethod.tooltip'}),
                arguments: {
                    CLASS_NAME: {
                        type: ArgumentType.STRING, menu: 'allClasses'
                    }, METHOD_NAME: {
                        type: ArgumentType.STRING
                    }, METHOD_TYPE: {
                        type: ArgumentType.NUMBER, menu: 'methodType'
                    }, METHOD_ACCESS_PERMISSIONS: {
                        type: ArgumentType.NUMBER, menu: 'AccessPermissions'
                    }, METHOD_RETURN_TYPE: {
                        type: ArgumentType.STRING, defaultValue: "void"
                    }, METHOD_FINAL: {
                        type: ArgumentType.BOOLEAN
                    }, args: {
                        type: "ccw_hat_parameter"
                    }
                }
            }
            // -----
            return {
                id: 'object_yes',

                color1: '#deb614', color2: '#e6aa12',

                name: "Object Yes", //description: translate({id: 'description'}),

                // blockIconURI: "TODO"

                // menuIconURI: "TODO"

                // docsURI: "TODO"

                blocks: [
                    `---${translate({id: 'text1'})}`,
                    createClass,
                    getClassesJSON,
                    createMethod
                ], // 菜单定义
                menus: {
                    classType: {
                        acceptReporters: true, items: [{
                            "text": translate({id: 'classType.class'}), "value": CLASS
                        }, {
                            "text": translate({id: 'classType.interface'}), "value": INTERFACE
                        }, {
                            "text": translate({id: 'classType.enum'}), "value": ENUM
                        }, {
                            "text": translate({id: 'classType.abstractClass'}), "value": ABSTRACT_CLASS
                        }]
                    }, AccessPermissions: {
                        acceptReporters: true, items: [{
                            "text": translate({id: 'AccessPermissions.public'}), "value": PUBLIC
                        },//所有位置均可访问
                            {
                                "text": translate({id: 'AccessPermissions.protected'}), "value": PROTECTED
                            },//只能在同角色内访问
                            {
                                "text": translate({id: 'AccessPermissions.private'}), "value": PRIVATE
                            }//只能在同类内访问
                        ]
                    }, methodType: {
                        acceptReporters: true, items: [{
                            "text": translate({id: 'methodType.method'}), "value": METHOD
                        }, {
                            "text": translate({id: 'methodType.staticMethod'}), "value": STATIC_METHOD
                        }, {
                            "text": translate({id: 'methodType.constructor'}), "value": CONSTRUCTOR
                        }, {
                            "text": translate({id: 'methodType.abstractMethod'}), "value": ABSTRACT_METHOD
                        }]
                    }, allClasses: {
                        acceptReporters: true, items: this.getAllClasses()
                    }, classes: {
                        acceptReporters: true, items: this.getClasses()
                    }, interfaces: {
                        acceptReporters: true, items: this.getInterfaces()
                    }, classesWithAbstract: {
                        acceptReporters: true, items: this.getClassesWithAbstract()
                    }
                }
            }
        }

        // 积木方法
        createClass(args) {
            if (args.ClassName === "") {
                return;
            }
            let extendClass = args.EXTENDS === "" ? "Object" : String(args.EXTENDS)
            let virtualMethods = Array(this.classList.filter(item => item.ClassName === extendClass).VirtualMethods);
            // 创建类
            let newClass = {
                ClassName: String(args.NAME),
                ClassType: Number(args.TYPE),
                AccessPermissions: Number(args.ACCESS_PERMISSIONS),
                Extends: extendClass,
                Implements: new RegExp(/([a-z_A-Z]\w*)(,\1)*/).test(args.IMPLEMENTS) ? args.IMPLEMENTS.split(",") : ["测试不成功"],
                Fields: [],
                Methods: [],
                VirtualMethods: virtualMethods
            }
            let items = this.classList.filter(item => item.ClassName === newClass.ClassName);
            // 判断类是否存在,存在则覆盖
            if (items.length > 0) {
                this.classList.splice(this.classList.indexOf(items[0]), 1, newClass)
            } else {
                // 判断类是否存在,不存在则添加
                this.classList.push(newClass)
            }
        }

        getClassesJSON() {
            return JSON.stringify(this.classList)
        }

        createMethod(args) {
            let classItem = this.classList.filter(item => item.ClassName === args.CLASS_NAME)[0];
            let method = {
                MethodName: String(args.METHOD_NAME),
                MethodType: Number(args.METHOD_TYPE),
                AccessPermissions: Number(args.METHOD_ACCESS_PERMISSIONS),
                Parameters: args.args.split(",").map(item => {
                    return {
                        ParameterName: item.split(":")[0], ParameterType: item.split(":")[1]
                    }
                }),//参数声明:  参数名1:参数类型1, 参数名2:参数类型2, ...
                ReturnType: String(args.METHOD_RETURN_TYPE),
                Final: Boolean(args.METHOD_FINAL),
                Native: false
            }
            let items = classItem.Methods.filter(item => item.MethodName === method.MethodName);
            // 判断方法是否存在,存在则覆盖
            if (items.length > 0) {
                classItem.Methods.splice(classItem.Methods.indexOf(items[0]), 1, method)
            } else {
                // 判断方法是否存在,不存在则添加
                classItem.Methods.push(method)
            }
        }

        //本地方法
        toString(obj) {
            return "0d" + obj.index
        }

        getObjectFromAddress(address) {
            return this.objectList[Number(address.substring(2))]
        }

        equals(obj1, obj2) {
            return obj1.index === obj2.index
        }

        getAllClasses() {
            let classes = [];
            this.classList.forEach(item => {
                classes.push(item.ClassName)
            });
            return classes;
        }

        getClasses() {
            let classes = [];
            this.classList.forEach(item => {
                if (item.ClassType === CLASS) {
                    classes.push(item.ClassName)
                }
            });
            return classes;
        }

        getInterfaces() {
            let classes = [];
            this.classList.forEach(item => {
                if (item.ClassType === INTERFACE) {
                    classes.push(item.ClassName)
                }
            });
            if (classes.length === 0) {
                classes.push(translate({id: 'empty'}))
            }
            return classes;
        }

        getClassesWithAbstract() {
            let classes = [];
            this.classList.forEach(item => {
                if (item.ClassType === ABSTRACT_CLASS || item.ClassType === CLASS) {
                    classes.push(item.ClassName)
                }
            });
            return classes;
        }
    }

    extensions.register(new ObjectYes(runtime));
}(Scratch));