//https://github.com/prbegd/Minecraft2D/blob/master/js/UsefulBlocks.js
(function (_Scratch) {
    //非沙盒
    'use strict';

    //初始化值
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': '有用积木',
            "getCurrentMills": "获取当前时间(毫秒)",
            "randomFromSeedRange": "在[MIN]和[MAX]中取种子随机数",
            "randomFromSeed": "取种子随机数",
            "setRandomSeed": "设置随机种子为[SEED]"
        },
        en: {
            'extensionName': 'UsefulBlocks',
            "getCurrentMills": "Get the current time (ms)",
            "randomFromSeedRange": "pick seed random [MIN] to [MAX]",
            "randomFromSeed": "pick seed random number",
            "setRandomSeed": "set random seed to [SEED]"
        }
    });

    let seed = Date.now()

    class UsefulBlocks {
        constructor(_runtime) {
            this._runtime = _runtime;
        }

        getInfo() {
            // 积木常量
            const rightShiftZeroComplementOperator = {
                opcode: "rightShiftZeroComplementOperator",
                blockType: BlockType.REPORTER,
                text: "[NUM1]>>>[NUM2]",
                arguments: {
                    NUM1: {
                        type: ArgumentType.NUMBER,
                        defaultValue:114
                    },
                    NUM2: {
                        type: ArgumentType.NUMBER,
                        defaultValue:5
                    }
                }
            }
            const getCurrentMills = {
                opcode: "getCurrentMills",
                blockType: BlockType.REPORTER,
                text: translate({id: 'getCurrentMills'})
            }
            const randomFromSeedRange = {
                opcode: "randomFromSeedRange",
                blockType: BlockType.REPORTER,
                text: translate({id: 'randomFromSeedRange'}),
                arguments: {
                    MIN: {
                        type: ArgumentType.NUMBER,
                        defaultValue:114
                    },
                    MAX: {
                        type: ArgumentType.NUMBER,
                        defaultValue:514
                    }
                }
            }
            const randomFromSeed = {
                opcode: "randomFromSeed",
                blockType: BlockType.REPORTER,
                text: translate({id: 'randomFromSeed'}),
                arguments: {
                }
            }
            const setRandomSeed = {
                opcode: "setRandomSeed",
                blockType: BlockType.COMMAND,
                text: translate({id: 'setRandomSeed'}),
                arguments: {
                    SEED: {
                        type: ArgumentType.NUMBER,
                        defaultValue:114514
                    }
                }
            }
            const returnSelf = {
                opcode: "returnSelf",
                blockType: BlockType.REPORTER,
                text: "[VALUE]",
                arguments: {
                    VALUE: {
                        type: ArgumentType.STRING
                    }
                }
            }
            // -----
            return {
                id: 'useful_blocks',

                color1: '#14C0DE',
                color2: '#12C6E6',

                name: translate({id: 'extensionName'}),

                // blockIconURI: "TODO"

                // menuIconURI: "TODO"

                // docsURI: "TODO"

                blocks: [
                    rightShiftZeroComplementOperator,
                    getCurrentMills,
                    //randomFromSeedRange,
                    randomFromSeed,
                    setRandomSeed,
                    returnSelf
                ],
            };

        }
        // 方法
        rightShiftZeroComplementOperator(args) {
            return args.NUM1 >>> args.NUM2
        }
        getCurrentMills() {
            return Date.now()
        }
        randomFromSeedRange(args) {
            return args.MIN + this.randomFromSeed() * (args.MAX - args.MIN)
        }
        randomFromSeed() {
            seed = (seed * 9301 + 49297) % 233280
            return seed// / 233280.0
        }
        setRandomSeed(args) {
            seed = args.SEED
        }
        returnSelf(args) {
            return args.VALUE
        }
    }
    extensions.register(new UsefulBlocks(runtime));

    window.tempExt = {
        Extension: UsefulBlocks,
        info: {
            name: 'UsefulBlocks.extensionName',
            description: 'UsefulBlocks.description',
            extensionId: "useful_blocks",
            // featured: true,
            // disabled: false,
            // collaborator: 'only for UsefulBlocks test',
            collaboratorList: [
                {
                    collaborator: 'xingab612 @ CCW',
                    collaboratorURL:
                        'https://www.ccw.site/student/6676d6e21dd9a76bab02b9b3',
                },
            ],
        },
        l10n: {
            'zh-cn': {
                'UsefulBlocks.extensionName': '有用积木',
                'UsefulBlocks.description': '提供一些有用(也许?)的积木',
            },
            en: {
                'UsefulBlocks.extensionName': 'Useful Blocks',
                'UsefulBlocks.description': 'Provide something useful (maybe?) of blocks',
            },
        },
    };
}(Scratch));