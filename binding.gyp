{
  'variables': {
    'openssl_fips': "",
  },
  'target_defaults': {
    'conditions': [
      [
        "OS==\"mac\"",
        {
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
            "MACOSX_DEPLOYMENT_TARGET": "10.7",
            "OTHER_CPLUSPLUSFLAGS": [
              "-std=c++20",
              "-stdlib=libc++"
            ],
            "OTHER_LDFLAGS": [
              "-stdlib=libc++"
            ]
          }
        }
      ],
      ['OS=="win"', {
        'msvs_configuration_attributes': {
          'SpectreMitigation': 'Spectre'
        },
        'msvs_settings': {
            'VCCLCompilerTool': {
              'AdditionalOptions': [
                '/guard:cf',
                '/w34244',
                '/we4267',
                '/ZH:SHA_256',
                '/std:c++17'
              ]
            },
            'VCLinkerTool': {
              'AdditionalOptions': [
                '/guard:cf'
              ]
            }
          },
      }],
    ],
  },
  'conditions': [
    ['OS=="win"', {
      'targets': [
        {
          'target_name': 'conpty',
          'include_dirs' : [
            '<!(node -e "require(\'nan\')")'
          ],
          'sources' : [
            'src/win/conpty.cc',
            'src/win/path_util.cc'
          ],
          'libraries': [
            'shlwapi.lib'
          ],
          'defines': [
            'NOMINMAX'
          ],
        },
        {
          'target_name': 'conpty_console_list',
          'include_dirs' : [
            '<!(node -e "require(\'nan\')")'
          ],
          'sources' : [
            'src/win/conpty_console_list.cc'
          ],
          'defines': [
            'NOMINMAX'
          ],
        },
        {
          'target_name': 'pty',
          'include_dirs' : [
            '<!(node -e "require(\'nan\')")',
            'deps/winpty/src/include',
          ],
          # Disabled due to winpty
          'msvs_disabled_warnings': [ 4506, 4530 ],
          'dependencies' : [
            'deps/winpty/src/winpty.gyp:winpty-agent',
            'deps/winpty/src/winpty.gyp:winpty',
          ],
          'sources' : [
            'src/win/winpty.cc',
            'src/win/path_util.cc'
          ],
          'libraries': [
            'shlwapi.lib'
          ],
          'defines': [
            'NOMINMAX'
          ],
        }
      ]
    }, { # OS!="win"
      'targets': [
        {
          'target_name': 'pty',
          'include_dirs' : [
            '<!(node -e "require(\'nan\')")'
          ],
          'sources': [
            'src/unix/pty.cc',
          ],
          'libraries': [
            '-lutil'
          ],
          'cflags': ['-Wall', '-std=c++17'],
          'cflags_cc': [ '-std=c++17' ],
          'conditions': [
            # http://www.gnu.org/software/gnulib/manual/html_node/forkpty.html
            #   One some systems (at least including Cygwin, Interix,
            #   OSF/1 4 and 5, and Mac OS X) linking with -lutil is not required.
            ['OS=="mac" or OS=="solaris"', {
              'libraries!': [
                '-lutil'
              ]
            }],
            ['OS=="mac"', {
              "xcode_settings": {
                "MACOSX_DEPLOYMENT_TARGET":"10.7",
                'CLANG_CXX_LANGUAGE_STANDARD':'c++17'
              }
            }]
          ]
        }
      ]
    }],
    ['OS=="mac"', {
      'targets': [
        {
          'target_name': 'spawn-helper',
          'type': 'executable',
          'sources': [
            'src/unix/spawn-helper.cc',
          ],
          "xcode_settings": {
            "MACOSX_DEPLOYMENT_TARGET":"10.7",
            'CLANG_CXX_LANGUAGE_STANDARD':'c++17'
          }
        },
      ]
    }]
  ]
}
