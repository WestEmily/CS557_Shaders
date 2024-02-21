#version 330 compatibility

uniform float uPower;
uniform float uRtheta;
uniform float uMosaic;
uniform float uBlend;
uniform sampler2D TexUnitA;
uniform sampler2D TexUnitB;

in vec2 vST;

const vec4 BLACK = vec4( 0., 0., 0., 1. );
const vec4 WHITE = vec4( 1., 1., 1., 1. );
const float PI = 3.1415926535897932384626433832795;

float
atan2( float y, float x )
{
        if( x == 0. )
        {
                if( y >= 0. )
                        return  PI/2.;
                else
                        return -PI/2.;
        }
        return atan(y,x);
}

void
main ()
{

    // Fisheye
    vec2 st = vST - vec2(0.5,0.5);  // put (0,0) in the middle so that the range is -0.5 to +0.5
    float r = length(st);
    float rprime = pow((2 * r), uPower);

    // Whirl
    float theta  = atan2( st.t, st.s );
    float thetaprime = theta - uRtheta * r;

    // Restoring (s,t)
    st = rprime * vec2( cos(thetaprime), sin(thetaprime) );  		// now in the range -1. to +1.
    st += 1;                        		// change the range to 0. to +2.
    st *= 0.5; 		       			// change the range to 0. to +1.

    // Mosaic
    // which block of pixels will this pixel be in?
    int numins = int(st.s / uMosaic);
    int numint = int(st.t / uMosaic);	
    float sc = numins * uMosaic + (uMosaic / 2.);		
    float tc = numint * uMosaic + (uMosaic / 2.);	
    // for this block of pixels, we are only going to sample the texture at the center:
    st.s = sc;
    st.t = tc;

    // Blacking out parts of the Image that don't reach the borders and blending
    if( any( lessThan(st, vec2(0., 0.)) ) )
    {
	    gl_FragColor = BLACK;
    }
    else
    {
	    if( any( greaterThan(st, vec2(1., 1.)) ) )
	    {
		    gl_FragColor = BLACK;
	    }
	    else
	    {
		    // sample both textures at (s,t) giving back two rgb vec3's:
		    // mix the two rgb's using uBlend

            vec3 tex1 = texture( TexUnitA, st).rgb;
            vec3 tex2 = texture( TexUnitB, st).rgb;

            vec3 rgb = mix( tex1, tex2, uBlend );

		    gl_FragColor = vec4( rgb, 1. );
	    }
    }
}